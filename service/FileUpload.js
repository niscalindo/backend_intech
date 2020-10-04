        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const fileUpload = db.file_upload;
const uploader = db.users;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.getAll = function(security,order, result){
    fileUpload.findAll({
        attributes:{
            exclude: ['createdBy']
        },
        where: {
            status:{
                [operator.eq]: '1'
            }
        },
        order: [
            ['id_file', order]
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
    let conditionKeyUser = new Object();
    let findByUser = false;
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "fileName"){
            op = operator.substring;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }else{
            if(key === "idUser"){
                findByUser = true;
                op = operator.eq;
                condition[op] = value;
                conditionKeyUser[columnDictionary(key)] = condition;                
            }else{
                op = operator.eq;
                condition[op] = value;
                conditionKey[columnDictionary(key)] = condition;
            }
        }
    }
    let condition = new Object();
    condition[operator.eq] = '1';
    conditionKey['status'] = condition;
    let includeUser = new Object();
    if(findByUser){
        includeUser = {
            model: uploader,
            as: 'uploader',
            exclude: ['createdBy','dateCreated','status'],
            where: [conditionKeyUser]
        }
    }else{
        includeUser = {
            model: uploader,
            as: 'uploader',
            exclude: ['createdBy','dateCreated','status']
        }
    }
    fileUpload.findAll({
        attributes:{
            exclude: ['createdBy']
        },
        include:[includeUser],
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
    newData['status'] = '1';  
    newData['dateCreated'] = new Date();   
    fileUpload.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            result(error,500,null);
        });        
    }).catch(err=>{
        result(err.message, 500, null);
    });
};
exports.update= function(newData, result){
    fileUpload.update(
        newData,
        {
            where: {id_file: parseInt(newData.id)}
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
    if(key === 'id'){
        return 'id_file';
    }else if(key === 'idUser'){
        return 'id_user';
    }else if(key === 'fileName'){
        return 'file_name';
    }else{
        return key;
    }
}