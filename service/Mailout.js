        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const mailout = db.tm_mail_out;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.getAll = function(security,order, result){
    mailout.findAll({
        where: {
            status:{
                [operator.ne]: '0'
            }
        },
        order: [
            ['id_email_out', order]
        ],
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            result(error, 500, null);
        });
    }).catch(err=>{
       result(err.message, 500, null);
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

//    let condition = new Object();
//    condition[operator.eq] = '1';
//    conditionKey['status'] = condition;
    
    mailout.findAll({
            where: [conditionKey]
        }).then(data=>{
            if(data == null){
                result("Not Found", 404, null);
            }else{
                security.encrypt(data)
                .then(function(encryptedData){
                    result("success", 200, encryptedData);
                }).catch(function(error){
                    result(error, 500, null);
                });            
            }
        }).catch(err=>{
        result(err.message, 500, null);
        });
}

exports.create = function(newData,security, result){
    newData['dateCreated'] = new Date();   
    mailout.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id_email_out;
            let newData = new Object();
            newData['id_email_out'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            result(error,500,null);
        });        
    }).catch(err=>{
        result(err.message, 500, null);
    });
};

exports.update= function(newData, result){
    mailout.update(
        newData,
        {
            where: {id_email_out: parseInt(newData.id_email_out)}
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

function columnDictionary(key){
    if(key === 'id_email_out'){
        return 'id_email_out';
    }else if(key === 'name'){
        return 'name';
    }else{
        return key;
    }
}