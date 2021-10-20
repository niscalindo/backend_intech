        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const trResetPassword = db.tr_reset_password;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;
const log = require('../utils/logger');

exports.find = function(security,field, result){
    trResetPassword.findOne({
        where: [
            {
                information_code:{
                    [operator.eq]: field.code
                }
            },
            {
                time_limit:{
                    [operator.gte]: field.time
                }
            }
        ]
    }).then(data=>{
        if(data == null){
            result("Not Found", 404, null);
        }else{
            let dataVerification = JSON.parse(JSON.stringify(data));
            if(typeof field.delete == 'undefined' || typeof field.delete == null){
                security.encrypt(data)
                .then(function(encryptedData){
                    result("success",200,encryptedData);
                }).catch(function(error){
                    log.resetPassword.error(error);
                    result("Encryption Failed", 1000, null);
                }); 
            }else{
                trResetPassword.destroy({
                    where: {id: parseInt(dataVerification.id)}
                }).then(dataDelete=>{
                    log.resetPassword.info("delete varification success");
                    security.encrypt(data)
                    .then(function(encryptedData){
                        result("success",200,encryptedData);
                    }).catch(function(error){
                        log.resetPassword.error(error);
                        result("Encryption Failed", 1000, null);
                    }); 
                }).catch(err=>{
                    log.resetPassword.error(err);
                    result("Internal Server Error", 500, null);
            //        result(err.message, 500, null);
                });
                
            }
        }
    }).catch(err=>{
        log.resetPassword.error(err);
        result("Internal Server Error", 500, null);
    });
}

exports.create = function(newData,security, result){
    trResetPassword.create(newData).then(data=>{
        result("success",201,1);
    }).catch(err=>{
        log.resetPassword.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.update= function(newData, result){
    let newObject = new Object();
    newObject.id = newData.id;
    newObject.password = newData.password;
    db.users.update(
        newObject,
        {
            where: {id_user: parseInt(newObject.id)}
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
