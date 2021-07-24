        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const virtualAccount = db.tm_virtual_account;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;
const log = require('../utils/logger');

exports.getAll = function(security,order, result){
    virtualAccount.findAll({
        attributes:{
            exclude: ['createdBy', 'dateCreated']
        },
        where: {
            status:{
                [operator.eq]: '1'
            }
        },
        order: [
            ['id_va', order]
        ],
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            log.virtualAccount.error(error);
            result("Encryption Failed", 1000, null);
        });
    }).catch(err=>{
        log.virtualAccount.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.find = function(security,field, result){
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "name"){
            op = operator.substring;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }else{
            op = operator.eq;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }
        
    }
    let condition = new Object();
    condition[operator.eq] = '1';
    conditionKey['status'] = condition;
    
    virtualAccount.findAll({
        attributes:{
            exclude: ['createdBy','dateCreated']
        },
        where: [conditionKey]
    }).then(data=>{
        if(data == null){
            result("Not Found", 404, null);
        }else{
            security.encrypt(data)
            .then(function(encryptedData){
                result("success", 200, encryptedData);
            }).catch(function(error){
                log.virtualAccount.error(error);
                result("Encryption Failed", 1000, null);
            });            
        }
    }).catch(err=>{
        log.virtualAccount.error(err);
        result("Internal Server Error", 500, null);
    });
}

exports.create = function(newData,security, result){
    newData['status'] = '1';  
    newData['dateCreated'] = new Date();   
    virtualAccount.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            log.virtualAccount.error(error);
            result("Encryption Failed", 1000, null);
        });        
    }).catch(err=>{
        log.virtualAccount.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.update= function(newData, result){
    virtualAccount.update(
        newData,
        {
            where: {id_va: parseInt(newData.id)}
        }).then(function(data){
        if(data[0] == 1){
            result("success", 200, data[0]);
        }else{
            result("no changes", 1001, data[0]);
        }
    })
    .catch(err=>{
        log.virtualAccount.error(err);
        result("Internal Server Error", 500, null);
    });
};

function columnDictionary(key){
    if(key === 'id'){
        return 'id_va';
    }else if(key === 'name'){
        return 'va_name';
    }else{
        return key;
    }
}