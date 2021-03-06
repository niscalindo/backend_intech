/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const district = require("../service/District");

exports.find = function(req, res){
    try{
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.idRegency === 'undefined' || typeof param.idRegency === null){
                response.ok('Bad Request', 401, null, res);
            }else{
                let encryptedData = [param.idRegency];
                security.decrypt(encryptedData)
                            .then(function(decryptedData){
                    district.find(security,decryptedData[0],function(message, status,data){
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
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.getById = function(req, res){
    try{
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.id === 'undefined' || typeof param.id === null){
                response.ok('Bad Request', 401, null, res);
            }else{
                let encryptedData = [param.id];
                security.decrypt(encryptedData)
                            .then(function(decryptedData){
                    district.getById(security,decryptedData[0],function(message, status,data){
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
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}