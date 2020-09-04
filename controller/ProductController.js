/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const productService = require("../service/Product");

exports.create = function(req, res){
    let data = req.body.product;
    let userToken = req.user;
    if(typeof data.idSubCategory === 'undefined' || typeof data.idSubCategory === null){
        response.ok('Bad Request', 401, null, res);
    }
    let encryptedData = [data.idSubCategory, userToken.id];
    if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
        encryptedData[2] = data.idFurtherSubCategory;
    }
    security.decrypt(encryptedData)
    .then(function(decryptedData){
        data.idSubCategory = decryptedData[0];
        data.createdBy = decryptedData[1];
        if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
           data.idFurtherSubCategory = decryptedData[2];
        }
        productService.create(data,security, function(message,status,data){
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
        response.ok('failed to decrypt code:'+err, 500, null, res); 
    });        
}

exports.find = function (req,res){
    try{
        let order = req.headers.order;
        let limit = req.headers.total_data;
        let offset = req.headers.page;
        let orderBy = req.headers.order_by;
        
        if(typeof order === 'undefined' || typeof order === null){
            order = 'desc';
        }
        if(typeof limit === 'undefined' || typeof limit === null){
            limit = 500;
        }
        
        if(typeof offset === 'undefined' || typeof offset === null){
            offset = 0;
        }
        if(typeof limit === 'undefined' || typeof limit === null){
            limit = 500;
        }
        if(typeof orderBy === 'undefined' || typeof orderBy === null){
            orderBy = 'id_product';
        }
        
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = new Array();
            let index = 0;
            if(typeof param.countRecords != 'undefined' && typeof param.countRecords != null){
                productService.countRecords(param,function(message, status,data){
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
                if(typeof param.id != 'undefined' && typeof param.id != null){
                    encryptedData[index] = param.id;
                    index++
                }

                if(typeof param.idVarian != 'undefined' && typeof param.idVarian != null){
                    encryptedData[index] = param.idVarian;
                    index++
                }

                if(typeof param.idSubCategory != 'undefined' && typeof param.idSubCategory != null){
                    encryptedData[index] = param.idSubCategory;
                    index++
                }
                security.decrypt(encryptedData)
                    .then(function(decryptedData){
                    index = 0;
                    if(typeof param.id != 'undefined' && typeof param.id != null){
                        param.id = decryptedData[index];
                        index++
                    }

                    if(typeof param.idVarian != 'undefined' && typeof param.idVarian != null){
                        param.idVarian = decryptedData[index];
                        index++
                    }

                    if(typeof param.idSubCategory != 'undefined' && typeof param.idSubCategory != null){
                        param.idSubCategory = decryptedData[index];
                        index++
                    }
                    productService.find(security,order,orderBy,parseInt(offset), parseInt(limit), param,function(message, status,data){
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
        response.ok(exception.message,500, null, res);
    }
}

exports.getAll = function (req,res){
    try{
        let userToken = req.user;
        let order = req.headers.order;
        let limit = req.headers.total_data;
        let offset = req.headers.page;
        if(typeof order === 'undefined' || typeof order === null){
            order = 'desc';
        }
        if(typeof limit === 'undefined' || typeof limit === null){
            limit = 500;
        }
        
        if(typeof offset === 'undefined' || typeof offset === null){
            offset = 0;
        }else{
            if(offset >= 1){
                offset = limit * (offset-1);
            }else{
                offset = 0;
            }
        }
        let encryptedData = [userToken.id];
        security.decrypt(encryptedData).then(function(decryptedData){
            productService.getAll(security,order,parseInt(offset), parseInt(limit),decryptedData[0],function(message, status,data){
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
            
        });
    }catch(exception){
        response.ok(exception.message,500, null, res);
    }
}
exports.update = function(req, res){
    let data = req.body.product;
    let userToken = req.user;
    if((typeof data.idSubCategory === 'undefined' || typeof data.idSubCategory === null)
            || (typeof data.id === 'undefined' || data.id === null)){
        response.ok('Bad Request', 401, null, res);
    }
    let encryptedData = [data.idSubCategory, userToken.id, data.id ];
    if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
        encryptedData[3] = data.idFurtherSubCategory;
    }
    security.decrypt(encryptedData)
    .then(function(decryptedData){
        data.idSubCategory = decryptedData[0];
        data.createdBy = decryptedData[1];
        data.id = decryptedData[2];
        if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
           data.idFurtherSubCategory = decryptedData[3];
        }
        productService.update(data,security, function(message,status,data){
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
        response.ok('failed to decrypt code:'+err, 500, null, res); 
    });        
}