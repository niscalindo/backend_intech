/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const productService = require("../service/Product");
const productVarianService = require("../service/ProductVarian");

exports.create = function(req, res){
    let data = req.body.product;
    let userToken = req.user;
    if((typeof data.idSubCategory === 'undefined' || typeof data.idSubCategory === null) || (typeof data.idBrand === 'undefined' || typeof data.idBrand === null)){
        response.ok('Bad Request', 401, null, res);
    }else{
        let encryptedData = [data.idSubCategory,userToken.id];
        let index = 2;
        if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
            encryptedData[index] = data.idFurtherSubCategory;
            index++;
        }
        if(data.idBrand != 'undefined' && data.idBrand != null){
            encryptedData[index] = data.idBrand;
        }
        security.decrypt(encryptedData)
        .then(function(decryptedData){
            data.idSubCategory = decryptedData[0];
            data.createdBy = decryptedData[1];
            index = 2;
            if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
                if(decryptedData[index] == null || decryptedData[index] == 'null' ){
                    data.idFurtherSubCategory = null;
                }else{
                    data.idFurtherSubCategory = decryptedData[index];                    
                }
                index++;
            }
            
            if(data.idBrand != 'undefined' && data.idBrand != null){
                data.idBrand = decryptedData[index];
            }
            
            console.log(data);
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
}

exports.find = function (req,res){
    try{
        let order = req.headers.order;
        let limit = req.headers.total_data;
        let offset = req.headers.page;
        let orderBy = req.headers.order_by;
        let scope = req.headers.scope;
        
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
        if(typeof orderBy === 'undefined' || typeof orderBy === null){
            orderBy = 'id_product';
        }
        
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = new Array();
            let index = 0;
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
                if(typeof param.idFurtherSubCategory != 'undefined' && typeof param.idFurtherSubCategory != null){
                    encryptedData[index] = param.idFurtherSubCategory;
                    index++
                }
                if(typeof param.idCategory != 'undefined' && typeof param.idCategory != null){
                    encryptedData[index] = param.idCategory;
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
                    if(typeof param.idFurtherSubCategory != 'undefined' && typeof param.idFurtherSubCategory != null){
                        param.idFurtherSubCategory = decryptedData[index];
                        index++
                    }
                    if(typeof param.idCategory != 'undefined' && typeof param.idCategory != null){
                        param.idCategory = decryptedData[index];
                        index++
                    }
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
                        productService.find(security,order,orderBy,parseInt(offset), parseInt(limit), param,scope,function(message, status,data){
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
                }).catch(function(error){
                    response.ok(error, 400, null, res); 
                });
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
        let orderBy = req.headers.order_by;
        let offset = req.headers.page;
        if(typeof orderBy === 'undefined' || typeof orderBy === null){
            orderBy = 'id_product';
        }
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
            productService.getAll(security,orderBy, order,parseInt(offset), parseInt(limit),decryptedData[0],function(message, status,data){
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
    console.log(data);
    let userToken = req.user;
    if((typeof data.id === 'undefined' || typeof data.id === null)
            || (typeof data.id === 'undefined' || data.id === null)){
        response.ok('Bad Request', 401, null, res);
    }else{
        let encryptedData = [data.id, userToken.id];
        if(data.idSubCategory != 'undefined' && data.idSubCategory != null){
            encryptedData[2] = data.idSubCategory;
        }
        if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
            encryptedData[3] = data.idFurtherSubCategory;
        }else{
            if(data.idSubCategory != 'undefined' && data.idSubCategory != null){
                data.idFurtherSubCategory = null;
            }
        }
        if(data.idBrand != 'undefined' && data.idBrand != null){
            encryptedData[4] = data.idBrand;
        }
        if(data.varian != "undefined" && data.varian != null){
            for(let i = 0; i<data.varian.length;i++){
                if( data.varian[i].id != "undefined" && data.varian[i].id != null){
                    encryptedData[(5+i)] = data.varian[i].id;
                }
            }
        }
        let size = encryptedData.length;
        if(data.pictures != "undefined" && data.pictures != null){ 
            for(let i = 0; i<data.pictures.length;i++){
                if( data.pictures[i].id != "undefined" && data.pictures[i].id != null){
                    encryptedData[(size+i)] = data.pictures[i].id;
                }
            }
        }
        security.decrypt(encryptedData)
        .then(function(decryptedData){
            data.createdBy = decryptedData[1];
            data.id = decryptedData[0];
            if(data.idSubCategory != 'undefined' && data.idSubCategory != null){
                data.idSubCategory = decryptedData[2];
            }
            if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
                if(decryptedData[3] === 'null' || decryptedData[3] === null){
                    data.idFurtherSubCategory = null; 
                }else{
                    data.idFurtherSubCategory = decryptedData[3];                    
                }
            }
            
            if(data.idBrand != 'undefined' && data.idBrand != null){
               data.idBrand = decryptedData[4];
            }
            
            if(data.varian != "undefined" && data.varian != null){
                for(let i = 0; i<data.varian.length;i++){
                    if( data.varian[i].id != "undefined" && data.varian[i].id != null){
                        data.varian[i].id = decryptedData[(5+i)];
                    }
                }
                
                let size = 5+(data.varian.length);
            }else{
                size = 5;
            }
            if(data.pictures != "undefined" && data.pictures != null){ 
                for(let i = 0; i<data.pictures.length;i++){
                    if( data.pictures[i].id != "undefined" && data.pictures[i].id != null){
                        data.pictures[i].id = decryptedData[(size+i)];
                    }
                }
            }
            productService.update(data,'product', function(message,status,data){
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
}

    //----------------------------------------------------------------//
    //-------------------- below is for varian------------------------//
    //----------------------------------------------------------------//
    exports.getAllByVarian = function (req,res){
        try{
            let userToken = req.user;
            let order = req.headers.order;
            let limit = req.headers.total_data;
            let orderBy = req.headers.order_by;
            let offset = req.headers.page;
            if(typeof orderBy === 'undefined' || typeof orderBy === null){
                orderBy = 'id_product';
            }
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
            let param = req.query;
//            if(typeof param === 'undefined' || typeof param === null){
//                response.ok('Bad Request', 401, null, res);
//            }else{
                productVarianService.find(security,orderBy, order,parseInt(offset), parseInt(limit),param,function(message, status,data){
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
//            }
        }catch(exception){
            response.ok(exception.message,500, null, res);
        }
    }