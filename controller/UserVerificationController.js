/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const userVerification = require("../service/UserVerification");
const log = require('../utils/logger');

exports.create = function(req, res){
    try{
        log.userVerification.info("Controller - request from : "+req.connection.remoteAddress);
        let newCode= req.body.code;
        if(typeof newCode === 'undefined' || typeof newCode === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newCode.idUser];
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newCode.idUser = decryptedLastNumerator[0];
                    userVerification.create(newCode,security, function(message,status,data){
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
                log.userVerification.error(err);
                response.ok('Internal Server Error', 500, null, res); 
            });
                        
        }
    }catch(exception){
        log.userVerification.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}

exports.find = function(req, res){
    try{
        log.userVerification.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if((typeof param === 'undefined' || typeof param === null) || (typeof param.code === 'undefined' || typeof param.code === null)) {
            response.ok('Bad Request', 401, null, res);
        }else{
            userVerification.find(security,param, function(message, status, data){
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
    }catch(exception){
        log.userVerification.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}