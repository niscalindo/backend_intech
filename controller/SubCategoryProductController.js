/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const subCategoryProduct = require("../service/SubCategoryProduct");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.subCategoryProduct.info("Controller - request from : "+req.connection.remoteAddress);
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        subCategoryProduct.getAll(security,order,function(message, status,data){
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
        log.subCategoryProduct.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.create = function(req, res){
    try{
        log.subCategoryProduct.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newSubCategory = req.body.subCategory;
        if(typeof newSubCategory === 'undefined' || typeof newSubCategory === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newSubCategory.idCategory];
            subCategoryProduct.findMaxNumerator(function(message, status, numerator){
                if(status == 400){
                    response.ok(message, 400, null, res);
                }else if(status == 200){
                    if(numerator == null || numerator == ""){
                        response.ok('failed to generate code', 400, numerator, res); 
                    }else{
                        security.decrypt(encryptedData)
                            .then(function(decryptedLastNumerator){
                                newSubCategory.subCategoryCode = generateCode(numerator.dataValues.numerator);
                                newSubCategory['createdBy'] = decryptedLastNumerator[0];
                                newSubCategory['idCategory'] = decryptedLastNumerator[1];
                                subCategoryProduct.create(newSubCategory,security, function(message,status,data){
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
                            log.subCategoryProduct.error(err);
                            response.ok('Internal Server Error',500,null, res);
                        });
                        
                    }
                }
            });
        }
    }catch(exception){
        log.subCategoryProduct.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.update = function(req, res){
    try{
        log.subCategoryProduct.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newSubCategory = req.body.subCategory;
        if(typeof newSubCategory === 'undefined' || typeof newSubCategory === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newSubCategory.id, userToken.id, newSubCategory.idCategory];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newSubCategory.id = decryptedId[0];
                        newSubCategory.createdBy = decryptedId[1];
                        newSubCategory.idCategory = decryptedId[2];
                        subCategoryProduct.update(newSubCategory, function(message,status,data){
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
                log.subCategoryProduct.error(error);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.subCategoryProduct.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.find = function(req, res){
    try{
        log.subCategoryProduct.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = new Array();
            let index = 0;
            if(typeof param.id != 'undefined' && typeof param.id != null){
                encryptedData[index]= param.id;
                index++;
            }
            if(typeof param.idCategory != 'undefined' && typeof param.idCategory != null){
                encryptedData[index]= param.idCategory
            }
            if(encryptedData.length > 0){
                security.decrypt(encryptedData)
                .then(function(data){
                    index = 0;
                    if(typeof param.id != 'undefined' && typeof param.id != null){
                        param.id = data[index];
                        index++;
                    }
                    if(typeof param.idCategory != 'undefined' && typeof param.idCategory != null){
                        param.idCategory = data[index];
                    }
                    subCategoryProduct.find(security,param, function(message, status, data){
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
                    log.slider.error(error);
                    response.ok('Internal Server Error',500,null, res);
                });                
            }else{
                subCategoryProduct.find(security,param, function(message, status, data){
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
            }
        }
    }catch(exception){
        log.subCategoryProduct.error(exception);
        response.ok('Internal Server Error',500,null, res);
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
    return "SUB-" + lastNumerator;
}
