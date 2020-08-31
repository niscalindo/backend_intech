/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var security = require('../utils/Security');
var db = require("../model");
var users = db.users;
var operator = db.Sequelize.Op;

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
                console.log(error.message);
                result(error.message,500,null);
            });  
        }      
    }).catch(err=>{
        result(err.message, 500, null);
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
            result("no changes", 200, data[0]);
        }
    })
    .catch(err=>{
        result(err.message, 500, null);
    });
};
function columnDictionary(alias){
     if(alias === "id"){
        return "id_user";        
    }else if(alias === "phoneNumber"){
        return "phone_number";        
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
