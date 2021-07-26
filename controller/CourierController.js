/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const courier = require("../service/Courier");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.courier.info("Controller - request from : "+req.connection.remoteAddress);
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        courier.getAll(security,order,function(message, status,data){
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
        log.courier.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}

exports.create = function(req, res){
    try{
        log.courier.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newCourier = req.body.courier;
        if(typeof newCourier === 'undefined' || typeof newCourier === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id];
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newCourier['createdBy'] = decryptedLastNumerator[0];
                    courier.create(newCourier,security, function(message,status,data){
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
                log.courier.error(err);
                response.ok('Internal Server Error', 500, null, res);
            });
        }
    }catch(exception){
        log.courier.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}

exports.update = function(req, res){
    try{
        log.courier.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newCourier = req.body.courier;
        if(typeof newCourier === 'undefined' || typeof newCourier === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newCourier.id, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newCourier.id = decryptedId[0];
                        newCourier.createdBy = decryptedId[1];
                        courier.update(newCourier, function(message,status,data){
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
                log.courier.error(error);
                response.ok('Internal Server Error', 500, null, res); 
            });
        }
    }catch(exception){
        log.courier.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}

exports.find = function(req, res){
    try{
        log.courier.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.id === 'undefined' || typeof param.id === null){
                courier.find(security,param, function(message, status, data){
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
                    courier.find(security,param, function(message, status, data){
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
                    log.courier.error(error);
                    response.ok('Internal Server Error', 500, null, res);
                });
            }
        }
    }catch(exception){
        log.courier.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}
