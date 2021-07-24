/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var security = require('../utils/Security');
var db = require("../model");
var tmUsers = db.tm_users;
var operator = db.Sequelize.Op;
const log = require('../utils/logger');

exports.login = function(field, result){
    let op = null;
    let conditionKey = new Object();
    for(let [key, value] of Object.entries(field)){
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
    tmUsers.findOne({
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
                security.generateToken(String(encryptedData.id), 'admin')
                .then(function(token){
                    encryptedData.dataValues.token = token;
                    result("success", 200, encryptedData);
                }).catch(function(error){
                    log.user.error(error);
                    result("Encryption Failed", 1000, null);
                })
            })
        }
    }).catch(err=>{
        log.user.error(err);
        result("Internal Server Error", 500, null);
    })
};

exports.find = function(isSameUser, field, result){
    
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
    conditionKey['USER_STATUS'] = condition;
    
    let excludeOptions = new Array();
    if(isSameUser){
        excludeOptions[0]='password';
        excludeOptions[1]='date_created';
    }else{
        excludeOptions[0]='password';
        excludeOptions[1]='date_created';  
        excludeOptions[2]='username';
        excludeOptions[3]='photo_account';  
        excludeOptions[4]='user_code'; 
        excludeOptions[5]='full_name'; 
        excludeOptions[6]='phone_number'; 
        excludeOptions[7]='id_citizen';
        excludeOptions[8]='photo_id_card';
        excludeOptions[9]='dob';
    }
    tmUsers.findAll({
        attributes: {
            exclude: excludeOptions
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
                log.user.error(error);
                result("Encryption Failed", 1000, null);
            });  
        }      
    }).catch(err=>{
        log.user.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.update= function(newData, result){
    tmUsers.update(
        newData,
        {
            where: {USER_ID: parseInt(newData.id)}
        }).then(function(data){
        if(data[0] == 1){
            result("success", 200, data[0]);
        }else{
            result("no changes", 1001, data[0]);
        }
    })
    .catch(err=>{
        log.user.error(err);
        result("Internal Server Error", 500, null);
    });
};

function columnDictionary(alias){
     if(alias === "id"){
        return "USER_ID";        
    }else if(alias === "phone"){
        return "USER_MOBILE";        
    }else if(alias === "privilege"){
        return "USER_PRIV";        
    }else if(alias === "username"){
        return "USER_NAME";        
    }else if(alias === "password"){
        return "USER_PASSWORD";        
    }else{
        return alias;
    }
}
