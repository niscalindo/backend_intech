/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const mailin = require("../service/Mailin");
const mailout = require("../service/Mailout");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.mailin.info("Controller - request from : "+req.connection.remoteAddress);
        const log = require('../utils/logger');
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        mailin.getAll(security,order,function(message, status,data){
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
        log.mailin.error(exception);
        response.ok('Internal Server Error',500,null, res); 
    }
}

exports.create = function(req, res){
    try{
        log.mailin.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newMailin = req.body.mailin;
        if(typeof newMailin === 'undefined' || typeof newMailin === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id_email_in];
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newMailin['createdBy'] = decryptedLastNumerator[0];
                    mailin.create(newMailin,security, function(message,status,data){
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
                log.mailin.error(err);
                response.ok('Internal Server Error',500,null, res); 
            });
        }
    }catch(exception){
        log.mailin.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.update = function(req, res){
    try{
        log.mailin.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newMailin = req.body.mailin;
        if(typeof newMailin === 'undefined' || typeof newMailin === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newMailin.id_email_in, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newMailin.id_email_in = decryptedId[0];
                        mailin.update(newMailin, function(message,status,data){
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
                log.mailin.error(error);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.mailin.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.find = function(req, res){
    try{
        log.mailin.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.id_email_in === 'undefined' || typeof param.id_email_in === null){
                mailin.find(security,param, function(message, status, data){
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
                    mailin.find(security,param, function(message, status, data){
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
                    log.mailin.error(error);
                    response.ok('Internal Server Error',500,null, res);
                });
            }
        }
    }catch(exception){
        log.mailin.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.findMailOut = function(req, res){
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
