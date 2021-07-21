/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const review = require("../service/Review");

exports.create = function(req, res){
    try{
        let userToken = req.user;
        let newReview = req.body.review;
        if(typeof newReview=== 'undefined' || typeof newReview === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newReview.id, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newReview.id = decryptedId[0];
                        newReview.createdBy = decryptedId[1];
                        review.create(newReview, function(message,status,data){
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
        let scope = req.headers.scope;
//        console.log(param);
//        let userData = req.user;  
        if((typeof param === 'undefined' || typeof param === null)) {
            response.ok('Bad Request', 401, null, res);
        }else{
//            let encryptedData = [userData.id];
            let index = 0;
            if(typeof param.idProductVarian != 'undefined' && typeof param.idProductVarian != null){
                encryptedData[index] = param.idProductVarian;
            }
            security.decrypt(encryptedData)
            .then(function(data){
//                param.createdBy = data[0];
//                console.log("test : "+data[1]);
                if(typeof param.idProductVarian != 'undefined' && typeof param.idProductVarian != null){
                    param.idOrder = data[0];
                }
                review.find(security,param, scope,function(message, status, data){
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
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}