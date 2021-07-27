/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const userPaymentAccount = require("../service/UserPaymentAccount");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.userPaymentAccount.info("Controller - request from : "+req.connection.remoteAddress);
        let headers = req.headers;
        let userData = req.user;
        let encryptedData = [userData.id];
        security.decrypt(encryptedData)
                .then(function(decryptedId){
            userPaymentAccount.getAll(security,decryptedId[0],function(message, status,data){
                if(status == 200 || status == 201){
                    if(data == null || data == ""){
                        response.ok('empty result', status, data, res); 
                    }else{
                        response.ok(message, status, data, res);                    
                    }
                }else{
                    response.ok(message, status, null, res);            
                }
            });
        }).catch(function (error){
            log.userPaymentAccount.error(error);
            response.ok('Internal Server Error',500,null, res);  
        });
    }catch(exception){
        log.userPaymentAccount.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}
exports.create = function(req, res){
    try{
        log.userPaymentAccount.info("Controller - request from : "+req.connection.remoteAddress);
        let userData = req.user;
        let newPaymentAccount = req.body.paymentAccount;
        if(typeof newPaymentAccount=== 'undefined' || typeof newPaymentAccount === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userData.id];
            security.decrypt(encryptedData)
                .then(function(decryptedData){
                    console.log(decryptedData)
                    newPaymentAccount ['idUser'] = decryptedData[0];
                    newPaymentAccount ['createdBy'] = decryptedData[0];
                    userPaymentAccount.create(newPaymentAccount,security, function(message,status,data){
                        if(status == 200 || status == 201){
                            if(data == null || data == ""){
                                response.ok('empty result', status, data, res); 
                            }else{
                                response.ok(message, status, data, res);                    
                            }
                        }else{
                            response.ok(message, status, null, res);            
                        }
                    });
            }).catch(function(err){
                log.userPaymentAccount.error(err);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.userPaymentAccount.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}
exports.update = function(req, res){
    try{
        log.userPaymentAccount.info("Controller - request from : "+req.connection.remoteAddress);
        let newPaymentAccount = req.body.paymentAccount;
        if(typeof newPaymentAccount === 'undefined' || typeof newPaymentAccount === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newPaymentAccount.id];
            security.decrypt(encryptedData)
            .then(function(decryptedId){
                        newPaymentAccount.id = decryptedId[0];
                        userPaymentAccount.update(newPaymentAccount, function(message,status,data){
                            if(status == 200 || status == 201){
                                if(data == null || data == ""){
                                    response.ok('empty result', status, data, res); 
                                }else{
                                    response.ok(message, status, data, res);                    
                                }
                            }else{
                                response.ok(message, status, null, res);            
                            }
                        });
            }).catch(function (error){
                log.userPaymentAccount.error(error);
                response.ok('Internal Server Error',500,null, res);  
            });
        }
    }catch(exception){
        log.userPaymentAccount.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.find = function(req, res){
    try{
        log.userPaymentAccount.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        param.idUser = req.user.id;
        let encryptedData = [param.idUser];
        security.decrypt(encryptedData)
                    .then(function(decryptedId){
            param.idUser = decryptedId[0];
            userPaymentAccount.find(security,param, function(message, status, data){
                if(status == 200 || status == 201){
                    if(data == null || data == ""){
                        response.ok('empty result', status, data, res); 
                    }else{
                        response.ok(message, status, data, res);                    
                    }
                }else{
                    response.ok(message, status, null, res);            
                }
            });       
        }).catch(function (error){
            log.userPaymentAccount.error(error);
            response.ok('Internal Server Error',500,null, res);   
        });
    }catch(exception){
        log.userPaymentAccount.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
};