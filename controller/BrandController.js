/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const brand = require("../service/Brand");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.brand.info("Controller - request from : "+req.connection.remoteAddress);
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        brand.getAll(security,order,function(message, status,data){
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
        log.brand.error(exception);
        response.ok(exception.message, 500, null, res);
    }
}

exports.create = function(req, res){
    try{
        log.brand.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newBrand = req.body.brand;
        if((typeof newBrand === 'undefined' || typeof newBrand === null) || (typeof newBrand.idParent === 'undefined' || typeof newBrand.idParent === null)){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newBrand.idParent];
            brand.findMaxNumerator(function(message, status, numerator){
                if(status == 400){
                    response.ok(message, 400, null, res);
                }else if(status == 200){
                    if(numerator == null || numerator == ""){
                        response.ok('failed to generate code', 400, numerator, res); 
                    }else{
                        security.decrypt(encryptedData)
                            .then(function(decryptedLastNumerator){
                                newBrand.code = generateCode(numerator.dataValues.numerator);
                                newBrand.createdBy = decryptedLastNumerator[0];
                                newBrand.idParent = decryptedLastNumerator[1];
                                brand.create(newBrand,security, function(message,status,data){
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
                            log.brand.error(err);
                            response.ok('Internal Server Error', 500, null, res); 
                        });
                        
                    }
                }
            });
        }
    }catch(exception){
        log.brand.error(exception);
        response.ok(exception.message, 500, null, res);
    }
}

exports.update = function(req, res){
    try{
        log.brand.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newBrand = req.body.brand;
        if(typeof newBrand === 'undefined' || typeof newBrand === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newBrand.id, userToken.id, newBrand.idParent];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newBrand.id = decryptedId[0];
                        newBrand.createdBy = decryptedId[1];
                        newBrand.idParent = decryptedId[2];
                        brand.update(newBrand, function(message,status,data){
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
                log.brand.error(error);
                response.ok("Internal Server Error", 500, null, res);   
            });
        }
    }catch(exception){
        log.brand.error(exception);
        response.ok(exception.message, 500, null, res);
    }
}

exports.find = function(req, res){
    try{
        log.brand.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if((typeof param === 'undefined' || typeof param === null) || (typeof param.parent === 'undefined' || typeof param.parent === null)) {
            response.ok('Bad Request', 401, null, res);
        }else{
            if((typeof param.id === 'undefined' || typeof param.id === null) && (typeof param.idParent === 'undefined' || typeof param.idParent === null)){
                brand.find(security,param, function(message, status, data){
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
                let encryptedData = new Array();
                let index = 0;
                if(typeof param.id != 'undefined' && typeof param.id != null){
                    encryptedData[index] = param.id;
                    index++;
                }
                if(typeof param.idParent != 'undefined' && typeof param.idParent != null){
                    encryptedData[index] = param.idParent;
                }
                security.decrypt(encryptedData)
                .then(function(data){
                    index = 0;
                    if(typeof param.id != 'undefined' && typeof param.id != null){
                        param.id = data[index];
                        index++;
                    }
                    if(typeof param.idParent != 'undefined' && typeof param.idParent != null){
                        param.idParent = data[index];
                    }
                    brand.find(security,param, function(message, status, data){
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
                    log.brand.error(exception);
                    response.ok("Internal Server Error", 500, null, res); 
                });
            }
        }
    }catch(exception){
        log.brand.error(exception);
        response.ok(exception.message, 500, null, res);
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
    return "BRN-" + lastNumerator;
}