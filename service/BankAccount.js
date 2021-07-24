        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const bankAccount = db.tm_bank_account;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;
const log = require('../utils/logger');

exports.getAll = function(security,order, result){
    bankAccount.findAll({
        attributes:{
            exclude: ['status','createdBy', 'dateCreated']
        },
        where: {
            status:{
                [operator.eq]: '1'
            }
        },
        order: [
            ['id_account', order]
        ],
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            log.bankAccount.error(error);
            result("Encryption Failed", 1000, null);
        });
    }).catch(err=>{
        log.bankAccount.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.create = function(newData,security, result){
    newData['status'] = '1';  
    newData['dateCreated'] = new Date();   
    bankAccount.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            log.bankAccount.error(error);
            result("Encryption Failed", 1000, null);
        });        
    }).catch(err=>{
        log.bankAccount.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.update= function(newData, result){
    bankAccount.update(
        newData,
        {
            where: {id_account: parseInt(newData.id)}
        }).then(function(data){
        if(data[0] == 1){
            result("success", 200, data[0]);
        }else{
            result("no changes", 1001, data[0]);
        }
    })
    .catch(err=>{
        log.bankAccount.error(err);
        result("Internal Server Error", 500, null);
    });
};