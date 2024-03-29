        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const address = db.tr_address;
const province = db.province;
const regency= db.regency;
const district= db.district;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;
const log = require('../utils/logger');

exports.find = function(security,field, result){
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "recipientName"){
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
    
    address.findAll({
        attributes:{
            exclude: ['createdBy','createdAt']
        },
        include:[{
                model: province,
                as: 'province'
            },
            {
                model: regency,
                as: 'city'
            },
            {
                model: district,
                as: 'district'
            }
        ],
        where: [conditionKey]
    }).then(data=>{
        if(data == null){
            result("Not Found", 404, null);
        }else{
            security.encrypt(data)
            .then(function(encryptedData){
                result("success", 200, encryptedData);
            }).catch(function(error){
                log.address.error(error);
                result("Encryption Failed", 1000, null);
            });            
        }
    }).catch(err=>{
        log.address.error(err);
        result("Internal Server Error", 500, null);
    });
}

exports.create = function(newData,security, result){
    newData['status'] = '1';  
    newData['dateCreated'] = new Date();   
    address.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            log.error(error);
            result("Encryption Failed", 1000, null);
        });        
    }).catch(err=>{
        log.address.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.update= function(newData, result){
    address.update(
        newData,
        {
            where: {id_address: parseInt(newData.id)}
        }).then(function(data){
        if(data[0] == 1){
            result("success", 200, data[0]);
        }else{
            result("no changes", 1001, data[0]);
        }
    })
    .catch(err=>{
        log.address.error(err);
        result("Internal Server Error", 500, null);
    });
};

function columnDictionary(key){
   if(key === 'idAddress'){
        return 'id_address';
    }else if(key === 'recipientName'){
        return 'recipient_name';
    }else if(key === 'id'){
        return 'id_address';
    }else if(key === 'idUser'){
        return 'id_user';
    }else if(key === 'privateAddress'){
        return 'private_address';
    }else if(key === 'storeAddress'){
        return 'store_address';
    }else if(key === 'returnAddress'){
        return 'return_address';
    }else{
        return key;
    }
}