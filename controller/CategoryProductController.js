/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const categoryProduct = require("../service/CategoryProduct");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.categoryProduct.info("Controller - request from : "+req.connection.remoteAddress);
        let headers = req.headers;
        let order = headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        let scope = headers.scope;
        if(typeof headers.scope === 'undefined' && typeof headers.scope === null){
            scope = 'desc';
        }
        categoryProduct.getAll(security,order,scope,function(message, status,data){
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
        log.categoryProduct.error(exception);
        response.ok("Internal Server Error", 500, null, res);
    }
}

exports.create = function(req, res){
    try{
        log.categoryProduct.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newCategory = req.body.category;
        if(typeof newCategory === 'undefined' || typeof newCategory === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id];
            categoryProduct.findMaxNumerator(function(message, status, numerator){
                if(status == 400){
                    response.ok(message, 400, null, res);
                }else if(status == 200){
                    if(numerator == null || numerator == ""){
                        response.ok('failed to generate code', 400, numerator, res); 
                    }else{
                        security.decrypt(encryptedData)
                            .then(function(decryptedLastNumerator){
                                newCategory.categoryCode = generateCode(numerator.dataValues.numerator);
                                newCategory['createdBy'] = decryptedLastNumerator[0];
                                categoryProduct.create(newCategory,security, function(message,status,data){
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
                            log.categoryProduct.error(exception);
                            response.ok('Internal Server Error', 500, null, res); 
                        });
                        
                    }
                }
            });
        }
    }catch(exception){
        log.categoryProduct.error(exception);
        response.ok("Internal Server Error", 500, null, res);
    }
}

exports.update = function(req, res){
    try{
        log.categoryProduct.info("Controller - request from : "+req.connection.remoteAddress);
        let newCategory = req.body.category;
        if(typeof newCategory === 'undefined' || typeof newCategory === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newCategory.id, newCategory.createdBy];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newCategory.id = decryptedId[0];
                        newCategory.createdBy = decryptedId[1];
                        categoryProduct.update(newCategory, function(message,status,data){
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
                log.categoryProduct.error(exception);
                response.ok("Internal Server Error", 500, null, res);   
            });
        }
    }catch(exception){
        log.categoryProduct.error(exception);
        response.ok("Internal Server Error", 500, null, res);
    }
}

exports.find = function(req, res){
    try{
        log.categoryProduct.info("Controller - request from : "+req.connection.remoteAddress);
        let scope = req.headers.scope_all;
        if(typeof scope === 'undefined' || typeof scope === null){
            scope = false;
        }
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.id === 'undefined' || typeof param.id === null){
                categoryProduct.find(security,param,scope, function(message, status, data){
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
                    categoryProduct.find(security,param, function(message, status, data){
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
                    log.categoryProduct.error(exception);
                    response.ok("Internal Server Error", 400, null, res); 
                });
            }
        }
    }catch(exception){
        log.categoryProduct.error(exception);
        response.ok("Internal Server Error", 500, null, res);
    }
}

function generateCode(lastNumerator){
    if (typeof lastNumerator === 'undefined' || typeof lastNumerator === null ) {
        lastNumerator = 0;
    }
    lastNumerator++;
    if (lastNumerator < 10) {
        lastNumerator = "000" + lastNumerator;
    } else if (lastNumerator >= 10 && lastNumerator < 100) {
        lastNumerator = "00" + lastNumerator;
    } else if (lastNumerator >= 100 && lastNumerator < 1000) {
        lastNumerator = "0" + lastNumerator;
    } else if (lastNumerator >= 1000 && lastNumerator < 10000) {
        lastNumerator = "" +lastNumerator;
    }
    return "CAT-" + lastNumerator;
}
