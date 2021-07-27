/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const chat = require("../service/Chat");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.chat.info("Controller - request from : "+req.connection.remoteAddress);
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'asc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        let role = req.headers.role;
        if(typeof role === 'undefined' || typeof role === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let user = req.user;
            let encryptedData = [user.id];
            security.decrypt(encryptedData)
                .then(function(decryptedId){
                chat.getAll(security,order,role,decryptedId, function(message, status,data){
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
                log.chat.error(error);
                response.ok('Internal Server Error',500,null, res);
            }); 
        }
    }catch(exception){
        log.chat.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}

exports.create = function(req, res){
    try{
        log.chat.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newMessage = req.body.chat;
        if((typeof newMessage === 'undefined' || typeof newMessage === null)){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id];
            let index = 1;
            if(newMessage.context != null && newMessage.context != ""){
                encryptedData[index] = newMessage.context;
                index++;
            }
            if(newMessage.idChat != null && newMessage.idChat != ""){
                encryptedData[index] = newMessage.idChat;
                index++;
            }
            if(newMessage.destinationId != null && newMessage.destinationId != ""){
                encryptedData[index] = newMessage.destinationId;
            }
            security.decrypt(encryptedData)
                .then(function(decryptedData){
                index = 1;
                if(newMessage.context != null && newMessage.context != ""){
                    newMessage.context = decryptedData[index];
                    index++;
                }
                if(newMessage.idChat != null && newMessage.idChat != ""){
                    newMessage.idChat = decryptedData[index];
                    index++;
                }
                if(newMessage.destinationId != null && newMessage.destinationId != ""){
                    newMessage.destinationId = decryptedData[index];
                    index++;
                }
                newMessage.createdBy = decryptedData[0];
                chat.create(newMessage,security, function(message,status,data){
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
                log.chat.error(err);
                response.ok('Internal Server Error', 500, null, res); 
            });
        }
    }catch(exception){
        log.chat.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}
