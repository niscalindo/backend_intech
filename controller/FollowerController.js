/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const follower = require("../service/Follower");

exports.create = function(req, res){
    try{
        let userToken = req.user;
        let following = req.body.following;
        if((typeof following === 'undefined' || typeof following=== null) || (typeof following.idStore === 'undefined' || typeof following.idStore === null)){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, following.idStore];
            security.decrypt(encryptedData)
                            .then(function(decryptedData){
                following.idUser = decryptedData[0];
                following.idStore = decryptedData[1];
                follower.create(following,security, function(message,status,data){
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
        if (typeof param != 'undefined' && typeof param != null){
            if(typeof param.by != 'undefined' && typeof param.by != null){
                if(typeof param.id != 'undefined' && typeof param.id != null){
                    encryptedData[0] = param.id;
                }else{
                    encryptedData[0] = userCredential.id;
                }
                security.decrypt(encryptedData)
                .then(function(data){
                    let id = data[0];
                    follower.find(security,param.by,id, function(message, status, data){
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
            }else{
                response.ok('Bad Request', 401, null, res);
            }
        }else{
            response.ok('Bad Request', 401, null, res);
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}