/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const cart = require("../service/Cart");
const log = require('../utils/logger');

exports.create = function(req, res){
    try{
        log.cart.info("Controller - request from : "+req.connection.remoteAddress);
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
                    param.idProductVarian = decryptedData[2];
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
                                encryptedData[1]=data[0].dataValues.products[0].dataValues.id_cart;
                                security.decrypt(encryptedData)
                                .then(function(decryptedData){
                                    console.log("idp: "+decryptedData[0]);
                                    console.log("ic : "+decryptedData[1]);
                                    param.idProductVarian = newCart.products[0].idProductVarian;
                                    cart.find(security,param, scope,function(message, status, data){
                                        if(status == 200 || status == 201){
                                            if(data == null || data == ""){
                                                let childCart = new Object();
                                                childCart.id_cart = decryptedData[1];
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
                                    log.cart.error(err);
                                    response.ok('Internal Server Error', 500, null, res); 
                                });
                            }
                        }else{
                            response.ok(message, status, null, res);            
                        }
                    });
            }).catch(function(err){
                log.cart.error(err);
                response.ok('Internal Server Error', 500, null, res); 
            });
        }
    }catch(exception){
        log.cart.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}

exports.delete = function(req, res){
    try{
        log.cart.info("Controller - request from : "+req.connection.remoteAddress);
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
                                encryptedData[1]=data[0].dataValues.id;
                                security.decrypt(encryptedData)
                                .then(function(decryptedData){
                                    cart.delete(decryptedData[0],decryptedData[1], function(message,status,data){
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
                                    log.cart.error(err);
                                    response.ok('Internal Server Error', 500, null, res); 
                                });
                            }
                        }else{
                            response.ok(message, status, null, res);            
                        }
                    });
            }).catch(function(err){
                log.cart.error(err);
                response.ok('Internal Server Error', 500, null, res); 
            });
        }
    }catch(exception){
        log.cart.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}

exports.find = function(req, res){
    try{
        log.cart.info("Controller - request from : "+req.connection.remoteAddress);
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
            log.cart.error(error);
            response.ok("Internal Server Error", 400, null, res); 
        });
    }catch(exception){
        log.cart.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}