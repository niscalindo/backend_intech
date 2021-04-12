/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const chat = require("../service/Chat");

exports.getAll = function(req, res){
    try{
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
                response.ok(error,500,null);
            }); 
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.create = function(req, res){
    try{
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
                response.ok('failed to generate code :'+err, 500, null, res); 
            });
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.update = function(req, res){
    try{
        let userToken = req.user;
        let newBrand = req.body.brand;
        if(typeof newBrand === 'undefined' || typeof newBrand === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newBrand.id, userToken.id, newBrand.idParent];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newBrand.id = decryptedId[0];
                        newBrand.createdBy = decryptedId[1];
                        newBrand.idParent = decryptedId[2];
                        brand.update(newBrand, function(message,status,data){
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
        if((typeof param === 'undefined' || typeof param === null) || (typeof param.parent === 'undefined' || typeof param.parent === null)) {
            response.ok('Bad Request', 401, null, res);
        }else{
            if((typeof param.id === 'undefined' || typeof param.id === null) && (typeof param.idParent === 'undefined' || typeof param.idParent === null)){
                brand.find(security,param, function(message, status, data){
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
                let encryptedData = new Array();
                let index = 0;
                if(typeof param.id != 'undefined' && typeof param.id != null){
                    encryptedData[index] = param.id;
                    index++;
                }
                if(typeof param.idParent != 'undefined' && typeof param.idParent != null){
                    encryptedData[index] = param.idParent;
                }
                security.decrypt(encryptedData)
                .then(function(data){
                    index = 0;
                    if(typeof param.id != 'undefined' && typeof param.id != null){
                        param.id = data[index];
                        index++;
                    }
                    if(typeof param.idParent != 'undefined' && typeof param.idParent != null){
                        param.idParent = data[index];
                    }
                    brand.find(security,param, function(message, status, data){
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
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

function generateCode(lastNumerator){
    if (typeof lastNumerator === 'undefined' || typeof lastNumerator === null ) {
        lastNumerator = 0;
    }
    lastNumerator++;
    if (lastNumerator < 10) {
        lastNumerator = "000" + lastNumerator;
    } else if (lastNumerator >= 10 && lastNumerator < 100) {
        lastNumerator = "00" + lastNumerator;
    } else if (lastNumerator >= 100 && lastNumerator < 1000) {
        lastNumerator = "0" + lastNumerator;
    } else if (lastNumerator >= 1000 && lastNumerator < 10000) {
        lastNumerator = "" +lastNumerator;
    }
    return "BRN-" + lastNumerator;
}