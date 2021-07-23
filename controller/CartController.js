/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const cart = require("../service/Cart");

exports.create = function(req, res){
    try{
        let userToken = req.user;
        let newCart = req.body.cart;
        if((typeof newCart === 'undefined' || typeof newCart === null) 
                || (typeof newCart.products === 'undefined' || typeof newCart.products === null)
                ){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newCart.idStore, newCart.products[0].idProductVarian];
            security.decrypt(encryptedData)
                .then(function(decryptedData){
                    newCart.idUser=decryptedData[0];
                    newCart.idStore=decryptedData[1];
                    newCart.products[0].idProductVarian=decryptedData[2];
                    let param = new Object();
                    param.idUser = newCart.idUser;
                    param.idStore = newCart.idStore;
                    let scope = 'all';
                    cart.find(security,param, scope,function(message, status, data){
                        if(status == 200 || status == 201){
                            if(data == null || data == ""){
                                cart.create(newCart,security, function(message,status,data){
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
                                encryptedData = new Array();
                                encryptedData[0]=data[0].dataValues.products[0].dataValues.idCartProduct;
                                security.decrypt(encryptedData)
                                .then(function(decryptedData){
                                    param.idProductVarian = newCart.products[0].idProductVarian;
                                    cart.find(security,param, scope,function(message, status, data){
                                        if(status == 200 || status == 201){
                                            if(data == null || data == ""){
                                                let childCart = new Object();
                                                childCart.id_cart = decryptedData[0];
                                                childCart.idProductVarian = newCart.products[0].idProductVarian;
                                                childCart.qty=newCart.products[0].qty;
                                                cart.createChild(childCart,security, function(message,status,data){
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
                                                let product = new Object();
                                                product.idCartProduct = decryptedData[0];
                                                product.qty = newCart.products[0].qty;
                                                cart.update(product, function(message,status,data){
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
                                        }else{
                                            response.ok(message, status, null, res);            
                                        }
                                    });
                                }).catch(function(err){
                                    response.ok('Error occured :'+err, 500, null, res); 
                                });
                            }
                        }else{
                            response.ok(message, status, null, res);            
                        }
                    });
            }).catch(function(err){
                response.ok('Error occured :'+err, 500, null, res); 
            });
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.delete = function(req, res){
    try{
        let userToken = req.user;
        let newCart = req.body.cart;
        if((typeof newCart === 'undefined' || typeof newCart === null) 
                || (typeof newCart.products === 'undefined' || typeof newCart.products === null)
                ){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newCart.idStore, newCart.products[0].idProductVarian];
            security.decrypt(encryptedData)
                .then(function(decryptedData){
                    newCart.idUser=decryptedData[0];
                    newCart.idStore=decryptedData[1];
                    newCart.products[0].idProductVarian=decryptedData[2];
                    let param = new Object();
                    param.idUser = newCart.idUser;
                    param.idStore = newCart.idStore;
                    param.idProductVarian = newCart.products[0].idProductVarian;
                    let scope = 'all';
                    cart.find(security,param, scope,function(message, status, data){
                        if(status == 200 || status == 201){
                            if(data == null || data == ""){
                                response.ok('empty result', status, data, res); 
                            }else{
                                encryptedData = new Array();
                                encryptedData[0]=data[0].dataValues.products[0].dataValues.idCartProduct;
                                security.decrypt(encryptedData)
                                .then(function(decryptedData){
                                    cart.delete(decryptedData[0], function(message,status,data){
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
                                    response.ok('Error occured :'+err, 500, null, res); 
                                });
                            }
                        }else{
                            response.ok(message, status, null, res);            
                        }
                    });
            }).catch(function(err){
                response.ok('Error occured :'+err, 500, null, res); 
            });
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.find = function(req, res){
    try{
        let param = req.query;
        let scope = req.headers.scope;
//        console.log(param);
        let userData = req.user;
        let encryptedData = [userData.id];
        security.decrypt(encryptedData)
        .then(function(data){
            param.idUser = data[0];
            cart.find(security,param, scope,function(message, status, data){
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
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}