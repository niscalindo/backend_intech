/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var security = require('../utils/Security');
var db = require("../model");
var tmUsers = db.tm_users;
var operator = db.Sequelize.Op;

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
                    result(error, 500, null);
                })
            })
        }
    }).catch(err=>{
        result(err.message, 500, null);
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
    conditionKey['USER_STATUS'] = condition;
    
    tmUsers.findAll({
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
                console.log(error.message);
                result(error.message,500,null);
            });  
        }      
    }).catch(err=>{
        result(err.message, 500, null);
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
            result("no changes", 200, data[0]);
        }
    })
    .catch(err=>{
        result(err.message, 500, null);
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
