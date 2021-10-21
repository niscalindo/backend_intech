/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var security = require('../utils/Security');
var db = require("../model");
var users = db.users;
var operator = db.Sequelize.Op;
const sequelize = db.sequelize;
const log = require('../utils/logger');

exports.login = function(field, result){
    let op = null;
    let conditionKey = new Object();
    for(let [key, value] of Object.entries(field)){
        let condition = new Object();
        op = operator.eq;
        condition[op] = value;
        conditionKey[columnDictionary(key)] = condition;
    }
    users.findOne({
        attributes:{
            exclude: ['password','date_created']
        },
        where: [conditionKey]
    }).then(data=>{
        if(typeof data === 'undefined' || typeof data === null || data === null){
            result("Not Found", 404, null);
        }else{
            security.encrypt(data)
                    .then(function(encryptedData){
                security.generateToken(String(encryptedData.id), 'customer')
                .then(function(token){
                    encryptedData.dataValues.token = token;
                    result("success", 200, encryptedData);
                }).catch(function(error){
                    log.users.error(error);
                    result("Encryption Failed", 1000, null);
                })
            })
        }
    }).catch(err=>{
        log.users.error(err);
        result("Internal Server Error", 500, null);
    })
};

exports.createSession = function(field, result){
    let op = null;
    let conditionKey = new Object();
    for(let [key, value] of Object.entries(field)){
        let condition = new Object();
        op = operator.eq;
        condition[op] = value;
        conditionKey[columnDictionary(key)] = condition;
    }
    users.findOne({
        attributes:{
            exclude: ['password','date_created']
        },
        where: [conditionKey]
    }).then(data=>{
        if(typeof data === 'undefined' || typeof data === null || data === null){
            result("Not Found", 404, null);
        }else{
            security.encrypt(data)
                    .then(function(encryptedData){
                security.generateToken(String(encryptedData.id), 'customer')
                .then(function(token){
                    encryptedData.dataValues.token = token;
                    result("success", 200, encryptedData);
                }).catch(function(error){
                    log.users.error(error);
                    result("Encryption Failed", 1000, null);
                })
            })
        }
    }).catch(err=>{
        log.users.error(err);
        result("Internal Server Error", 500, null);
    })
};

exports.find = function(field, result){
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
    
    users.findAll({
        attributes: {
            exclude: ['password','date_created']
          },
        where: [conditionKey]
    }).then(data=>{
        if(Array.isArray(data) && data.length == 0){
            result('not found',404,null);
        }else{
            security.encrypt(data)
            .then(function(encryptedData){
                result("success",200,encryptedData);
            }).catch(function(error){
                log.users.error(error);
                result("Encryption Failed", 1000, null);
            });  
        }      
    }).catch(err=>{
        log.users.error(err);
        result("Internal Server Error", 500, null);
    });
};
exports.update= function(newData, result){
    users.update(
        newData,
        {
            where: {id_user: parseInt(newData.id)}
        }).then(function(data){
        if(data[0] == 1){
            result("success", 200, data[0]);
        }else{
            result("no changes", 1001, data[0]);
        }
    })
    .catch(err=>{
        log.users.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.create = function(newData,security, result){
    newData['status'] = '2';  
    newData['createdAt'] = new Date();   
    users.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            log.users.error(error);
            result("Encryption Failed", 1000, null);
        });        
    }).catch(err=>{
        log.users.error(err);
        result("Internal Server Error", 500, null);
    });
};


exports.findMaxNumerator= function( result){
    users.findOne({
        attributes:[
            [sequelize.fn('max', sequelize.col('id_user')), 'numerator']
        ],
        order: [
            ['id_user', 'desc']
        ]
    }).then(data=>{
        result("success", 200, data);
    }).catch(err=>{
        log.users.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.checkExisting= function(field, result){
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        op = operator.eq;
        condition[op] = value;
        conditionKey[columnDictionary(key)] = condition;        
    }
    
    users.findOne({
        attributes: ['status', ['id_user','idUser']],
        where: [conditionKey]
    }).then(data=>{
        if(typeof data == 'undefined' || typeof data == null){
            result('not found',404,null);
        }else{
            security.encrypt(data)
            .then(function(encryptedData){
                result("success",200,encryptedData);
            }).catch(function(error){
                log.users.error(error);
                result("Encryption Failed", 1000, null);
            }); 
        }      
    }).catch(err=>{
        log.users.error(err);
        result("Internal Server Error", 500, null);
    });
};

function columnDictionary(alias){
     if(alias === "id"){
        return "id_user";        
    }else if(alias === "phoneNumber"){
        return "phone_number";        
    }else if(alias === "rememberToken"){
        return "remember_token";        
    }else if(alias === "id_citizen"){
        return "id_citizen";        
    }else if(alias === "serialNumber"){
        return "serial_number";        
    }else if(alias === "sellerStar"){
        return "seller_star";        
    }else if(alias === "storeName"){
        return "store_name";        
    }else{
        return alias;
    }
}
