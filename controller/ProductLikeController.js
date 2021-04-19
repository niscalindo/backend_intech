/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const productLike = require("../service/ProductLike");

exports.create = function(req, res){
    try{
        let userToken = req.user;
        let newLike = req.body.like;
        if((typeof newLike === 'undefined' || typeof newLike === null) || (typeof newLike.idProductVarian === 'undefined' || typeof newLike.idProductVarian === null)){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newLike.idProductVarian];
            security.decrypt(encryptedData)
                            .then(function(decryptedData){
                newLike.idUser = decryptedData[0];
                newLike.idProductVarian = decryptedData[1];
                productLike.create(newLike,security, function(message,status,data){
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
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.find = function(req, res){
    try{
        let param = req.query;
        let userCredential = req.user;
        let encryptedData = new Array();
        let findBy = "user";            
        if (typeof param.idProductVarian != 'undefined' && typeof param.idProductVarian != null){
            encryptedData[0] = param.idProductVarian;
            findBy = "product";
        }else{
            encryptedData[0] = userCredential.id;
        }
        security.decrypt(encryptedData)
        .then(function(data){
            let id = data[0];
            productLike.find(security,findBy,id, function(message, status, data){
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