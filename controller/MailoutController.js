/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const mailout = require("../service/Mailout");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.mailout.info("Controller - request from : "+req.connection.remoteAddress);
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        mailout.getAll(security,order,function(message, status,data){
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
        log.mailout.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.create = function(req, res){
    try{
        log.mailout.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newMailout = req.body.mailout;
        if(typeof newMailout === 'undefined' || typeof newMailout === null ){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newMailout.id_email_in];
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newMailout['createdBy'] = decryptedLastNumerator[0];
                    newMailout['id_email_in'] = decryptedLastNumerator[1];
                    mailout.create(newMailout,security, function(message,status,data){
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
                log.mailout.error(err);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.mailout.error(eexception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.update = function(req, res){
    try{
        log.mailout.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newMailout = req.body.mailout;
        if(typeof newMailout === 'undefined' || typeof newMailout === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newMailout.id_email_out, userToken.id_email_out];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newMailout.id_email_out = decryptedId[0];
                        mailout.update(newMailout, function(message,status,data){
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
                log.mailout.error(error);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.mailout.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.find = function(req, res){
    try{
        log.mailout.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.id_email_in === 'undefined' || typeof param.id_email_in === null){
                mailout.find(security,param, function(message, status, data){
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
                let encryptedData = [param.id_email_in];
                security.decrypt(encryptedData)
                .then(function(data){
                    param.id_email_in = data;
                    mailout.find(security,param, function(message, status, data){
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
                    log.mailout.error(error);
                    response.ok('Internal Server Error',500,null, res);
                });
            }
        }
    }catch(exception){
        log.mailout.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}