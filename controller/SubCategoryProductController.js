/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const subCategoryProduct = require("../service/SubCategoryProduct");

exports.getAll = function(req, res){
    try{
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
        response.ok(exception.message, 500, null, res);
    }
}

exports.create = function(req, res){
    try{
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
                            response.ok('failed to generate code :'+err, 500, null, res); 
                        });
                        
                    }
                }
            });
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.update = function(req, res){
    try{
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
                response.ok("data not found : "+error, 500, null, res);   
            });
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.find = function(req, res){
    try{
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.id === 'undefined' || typeof param.id === null){
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
            }else{
                let encryptedData = [param.id];
                security.decrypt(encryptedData)
                .then(function(data){
                    param.id = data;
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
                    response.ok(error, 400, null, res); 
                });
            }
        }
    }catch(exception){
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
    return "SUB-" + lastNumerator;
}
