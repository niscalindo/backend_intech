/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const furtherSubCategoryProduct = require("../service/FurtherSubCategoryProduct");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.furtherSubCategory.info("Controller - request from : "+req.connection.remoteAddress);
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        furtherSubCategoryProduct.getAll(security,order,function(message, status,data){
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
        log.furtherSubCategory.error(exception);
        response.ok('Internal Server Error',500,null);
    }
}

exports.create = function(req, res){
    try{
        log.furtherSubCategory.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newFurtherSubCategory = req.body.furtherSubCategory;
        if(typeof newFurtherSubCategory === 'undefined' || typeof newFurtherSubCategory === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newFurtherSubCategory.idSubCategory];
            furtherSubCategoryProduct.findMaxNumerator(function(message, status, numerator){
                if(status == 400){
                    response.ok(message, 400, null, res);
                }else if(status == 200){
                    if(numerator == null || numerator == ""){
                        log.furtherSubCategory.error('Failed to generate code');
                        response.ok('Internal Server Error', 1003, numerator, res); 
                    }else{
                        security.decrypt(encryptedData)
                            .then(function(decryptedLastNumerator){
                                newFurtherSubCategory.furtherSubCategoryCode = generateCode(numerator.dataValues.numerator);
                                newFurtherSubCategory['createdBy'] = decryptedLastNumerator[0];
                                newFurtherSubCategory['idSubCategory'] = decryptedLastNumerator[1];
                                furtherSubCategoryProduct.create(newFurtherSubCategory,security, function(message,status,data){
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
                            log.furtherSubCategory.error(err);
                            response.ok('Internal Server Error',500,null);
                        });
                        
                    }
                }
            });
        }
    }catch(exception){
        log.furtherSubCategory.error(exception);
        response.ok('Internal Server Error',500,null);
    }
}

exports.update = function(req, res){
    try{
        log.furtherSubCategory.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newFurtherSubCategory = req.body.furtherSubCategory;
        if(typeof newFurtherSubCategory === 'undefined' || typeof newFurtherSubCategory === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newFurtherSubCategory.id, userToken.id];
            if(typeof newFurtherSubCategory.idSubCategory != 'undefined' && typeof newFurtherSubCategory.idSubCategory != null){
                encryptedData[2]= newFurtherSubCategory.idSubCategory;
            }
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newFurtherSubCategory.id = decryptedId[0];
                        newFurtherSubCategory.createdBy = decryptedId[1];
                        if(typeof newFurtherSubCategory.idSubCategory != 'undefined' && typeof newFurtherSubCategory.idSubCategory != null){
                            newFurtherSubCategory.idSubCategory = decryptedId[2];
                        }
                        furtherSubCategoryProduct.update(newFurtherSubCategory, function(message,status,data){
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
                log.furtherSubCategory.error(error);
                response.ok('Internal Server Error',500,null);  
            });
        }
    }catch(exception){
        log.furtherSubCategory.error(exception);
        response.ok('Internal Server Error',500,null);
    }
}

exports.find = function(req, res){
    try{
        log.furtherSubCategory.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if((typeof param.id === 'undefined' || typeof param.id === null) && (typeof param.idSubCategory === 'undefined' || typeof param.idSubCategory === null)){
                furtherSubCategoryProduct.find(security,param, function(message, status, data){
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
                let index = 0;
                let encryptedData = new Array();
                if(typeof param.id != 'undefined' && typeof param.id != null){
                    encryptedData[index] = param.id;
                    index++;
                }
                if(typeof param.idSubCategory != 'undefined' && typeof param.idSubCategory != null){
                    encryptedData[index] = param.idSubCategory;
                }
                security.decrypt(encryptedData)
                .then(function(data){
                    index = 0;
                    if(typeof param.id != 'undefined' && typeof param.id != null){
                        param.id = data[index];
                        index++;
                    }
                    if(typeof param.idSubCategory != 'undefined' && typeof param.idSubCategory != null){
                        param.idSubCategory = data[index];
                    }
                    furtherSubCategoryProduct.find(security,param, function(message, status, data){
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
                    log.furtherSubCategory.error(error);
                    response.ok('Internal Server Error',500,null);
                });
            }
        }
    }catch(exception){
        log.furtherSubCategory.error(exception);
        response.ok('Internal Server Error',500,null);
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
    return "FUB-" + lastNumerator;
}
