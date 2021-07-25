/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const bankAccount = require("../service/BankAccount");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.bankInfo.info("Controller - request from : "+req.connection.remoteAddress);
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        bankAccount.getAll(security,order,function(message, status,data){
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
    }catch(exception){
        log.bankAccount.error(exception);
        response.ok(exception.message, 500, null, res);
    }
}

exports.create = function(req, res){
    try{
        log.bankInfo.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newBankAccount = req.body.bank;
        if((typeof newBankAccount === 'undefined' || typeof newBankAccount === null)){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id];
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newBankAccount.createdBy = decryptedLastNumerator[0];
                    bankAccount.create(newBankAccount,security, function(message,status,data){
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
                log.bankAccount.error(err);
                response.ok('Internal Server Error', 500, null, res); 
            });
        }
    }catch(exception){
        log.bankAccount.error(exception);
        response.ok(exception.message, 500, null, res);
    }
}

exports.update = function(req, res){
    try{
        log.bankInfo.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newBankAccount = req.body.bank;
        if(typeof newBankAccount === 'undefined' || typeof newBankAccount === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newBankAccount.id, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newBankAccount.id = decryptedId[0];
                        newBankAccount.createdBy = decryptedId[1];
                        bankAccount.update(newBankAccount, function(message,status,data){
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
                log.bankAccount.error(error);
                response.ok("Internal Server Error", 500, null, res);   
            });
        }
    }catch(exception){
        log.bankAccount.error(exception);
        response.ok(exception.message, 500, null, res);
    }
}