/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const visitor = require("../service/Visitor");
const log = require('../utils/logger');

exports.count = function(req, res){
    try{
        log.visitor.info("Controller - request from : "+req.connection.remoteAddress);
        let userCredential = req.user;
        let encryptedData = [userCredential.id];
        security.decrypt(encryptedData)
            .then(function(decryptedData){
            let idStore = decryptedData[0];
            visitor.countVisitor(idStore,function(message, status,data){
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
            log.visitor.error(err);
            response.ok('Internal Server Error', 500, null, res); 
        });
    }catch(exception){
        log.visitor.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}

exports.create = function(req, res){
    try{
        log.visitor.info("Controller - request from : "+req.connection.remoteAddress);
        let userCredential= req.user;
        let newVisitor = req.body.visitor;
        if(typeof newVisitor === 'undefined' || typeof newVisitor=== null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userCredential.id, newVisitor.idStore];
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newVisitor.idVisitor = decryptedLastNumerator[0];
                    newVisitor.idStore = decryptedLastNumerator[1];
                    visitor.create(newVisitor,security, function(message,status,data){
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
                log.visitor.error(err);
                response.ok('Internal Server Error', 500, null, res); 
            });
        }
    }catch(exception){
        log.visitor.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}
