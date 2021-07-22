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