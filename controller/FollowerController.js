/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const follower = require("../service/Follower");
const log = require('../utils/logger');

exports.create = function(req, res){
    try{
        log.follower.info("Controller - request from : "+req.connection.remoteAddress);
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
                log.follower.error(err);
                response.ok('Internal Server Error',500,null);
            });
                        
        }
    }catch(exception){
        log.follower.error(exception);
        response.ok('Internal Server Error',500,null);
    }
}

exports.find = function(req, res){
    try{
        log.follower.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        let userCredential = req.user;
        let scope = req.headers.scope;
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
                    follower.find(security,param.by,id,scope, function(message, status, data){
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
                    log.follower.error(error);
                    response.ok('Internal Server Error',500,null);
                });
            }else{
                response.ok('Bad Request', 401, null, res);
            }
        }else{
            response.ok('Bad Request', 401, null, res);
        }
    }catch(exception){
        log.follower.error(exception);
        response.ok('Internal Server Error',500,null);
    }
}