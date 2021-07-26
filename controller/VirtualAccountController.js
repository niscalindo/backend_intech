/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const virtualAccount = require("../service/VirtualAccount");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.virtualAccount.info("Controller - request from : "+req.connection.remoteAddress);
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        virtualAccount.getAll(security,order,function(message, status,data){
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
        log.virtualAccount.error(exception);
        response.ok('Internal Server Error',500,null);
    }
}

exports.create = function(req, res){
    try{
        log.virtualAccount.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newVA = req.body.virtual_account;
        if(typeof newVA === 'undefined' || typeof newVA === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id];
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newVA['createdBy'] = decryptedLastNumerator[0];
                    virtualAccount.create(newVA,security, function(message,status,data){
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
                log.virtualAccount.error(err);
                response.ok('Internal Server Error',500,null);
            });
        }
    }catch(exception){
        log.virtualAccount.error(exception);
        response.ok('Internal Server Error',500,null);
    }
}

exports.update = function(req, res){
    try{
        log.virtualAccount.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newVA = req.body.virtual_account;
        if(typeof newVA === 'undefined' || typeof newVA === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newVA.id, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newVA.id = decryptedId[0];
                        newVA.createdBy = decryptedId[1];
                        virtualAccount.update(newVA, function(message,status,data){
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
                log.virtualAccount.error(error);
                response.ok('Internal Server Error',500,null);   
            });
        }
    }catch(exception){
        log.virtualAccount.error(exception);
        response.ok('Internal Server Error',500,null);
    }
}

exports.find = function(req, res){
    try{
        log.virtualAccount.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.id === 'undefined' || typeof param.id === null){
                virtualAccount.find(security,param, function(message, status, data){
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
            }else{
                let encryptedData = [param.id];
                security.decrypt(encryptedData)
                .then(function(data){
                    param.id = data;
                    virtualAccount.find(security,param, function(message, status, data){
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
                }).catch(function(error){
                    log.virtualAccount.error(error);
                    response.ok('Internal Server Error',500,null);
                });
            }
        }
    }catch(exception){
        log.virtualAccount.error(exception);
        response.ok('Internal Server Error',500,null);
    }
}
