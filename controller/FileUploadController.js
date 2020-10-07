/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const fileUpload = require("../service/FileUpload");

exports.getAll = function(req, res){
    try{
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        fileUpload.getAll(security,order,function(message, status,data){
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
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.create = function(req, res){
    try{
        let userToken = req.user;
        let newFile = req.body.fileUpload;
        if((typeof newFile === 'undefined' || typeof newFile === null)){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id];
                security.decrypt(encryptedData)
                    .then(function(decryptedLastNumerator){
                        newFile.createdBy = decryptedLastNumerator[0];
                        newFile.idUser = decryptedLastNumerator[0];
                        fileUpload.create(newFile,security, function(message,status,data){
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
        let newFile = req.body.fileUpload;
        console.log(newFile);
        if((typeof newFile === 'undefined' || typeof newFile === null) && (typeof newFile.id === 'undefined' || typeof newFile.id === null)){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newFile.id];
                security.decrypt(encryptedData)
                    .then(function(decryptedLastNumerator){
                        newFile.createdBy = decryptedLastNumerator[0];
                        newFile.id = decryptedLastNumerator[1];
                        fileUpload.update(newFile,function(message,status,data){
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
        if((typeof param === 'undefined' || typeof param === null) || (typeof param.parent === 'undefined' || typeof param.parent === null)) {
            response.ok('Bad Request', 401, null, res);
        }else{
            if((typeof param.id === 'undefined' || typeof param.id === null) && (typeof param.idUser === 'undefined' || typeof param.idUser === null)){
                fileUpload.find(security,param, function(message, status, data){
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
                if(typeof param.idUser != 'undefined' && typeof param.idUser != null){
                    encryptedData[index] = param.idUser;
                }
                security.decrypt(encryptedData)
                .then(function(data){
                    index = 0;
                    if(typeof param.id != 'undefined' && typeof param.id != null){
                        param.id = data[index];
                        index++;
                    }
                    if(typeof param.idUser != 'undefined' && typeof param.idUser != null){
                        param.idUser = data[index];
                    }
                    fileUpload.find(security,param, function(message, status, data){
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