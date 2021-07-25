/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
var response = require('../model/response');
var address = require('../service/Address');
var security = require('../utils/Security');
const log = require('../utils/logger');

exports.find = function(req, res){
    try{
        log.address.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            param.idUser = req.user.id;
            if(typeof param.idUser === 'undefined' || typeof param.idUser === ""){
                response.ok('Bad Request', 401, null, res);                
            }else{
                let encryptedData = [param.idUser];
                security.decrypt(encryptedData)
                            .then(function(decryptedId){
                    param.idUser = decryptedId[0];
                    address.find(security,param, function(message, status, data){
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
                    log.address.error(error);
                    response.ok("Internal Server Error", 500, null, res);   
                });                
            }
        }
    }catch(exception){
        log.address.error(exception);
        response.ok("Internal Server Error", 500, null, res);
    }
};

exports.update = function(req, res){
    try{
        log.address.info("Controller request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newAddress = req.body.address;
        if(typeof newAddress === 'undefined' || typeof newAddress === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newAddress.id, userToken.id];
            let index=2;
            if(typeof newAddress.idProvince != 'undefined' && typeof newAddress.idProvince != null){
                encryptedData[index]=newAddress.idProvince;
                index++;
            }
            if(typeof newAddress.idCity != 'undefined' && typeof newAddress.idCity != null){
                encryptedData[index]=newAddress.idCity;
                index++;
            }
            if(typeof newAddress.idDistrict != 'undefined' && typeof newAddress.idDistrict != null){
                encryptedData[index]=newAddress.idDistrict;
                index++;
            }
            // console.log(encryptedData)
            security.decrypt(encryptedData)
            .then(function(decryptedId){
                newAddress.id = decryptedId[0];
                newAddress.createdBy = decryptedId[1];
                // console.log(decryptedId);
                index=2;
                if(typeof newAddress.idProvince != 'undefined' && typeof newAddress.idProvince != null){
                    newAddress.idProvince = decryptedId[index];
                    index++;
                }
                if(typeof newAddress.idCity != 'undefined' && typeof newAddress.idCity != null){
                    newAddress.idCity = decryptedId[index];
                    index++;
                }
                if(typeof newAddress.idDistrict != 'undefined' && typeof newAddress.idDistrict != null){
                    newAddress.idDistrict = decryptedId[index];
                    index++;
                }
                newAddress.idUser = decryptedId[1];
                address.update(newAddress, function(message,status,data){
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
                log.address.error(error);
                response.ok("Internal Server Error", 500, null, res);   
            });
        }
    }catch(exception){
        log.address.error(error);
        response.ok("Internal Server Error", 500, null, res);
    }
};

exports.create = function(req, res){
    try{
        log.address.info("Controller request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newAddress = req.body.address;
        if(typeof newAddress === 'undefined' || typeof newAddress === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newAddress.idProvince, newAddress.idCity, newAddress.idDistrict];
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newAddress['createdBy'] = decryptedLastNumerator[0];
                    newAddress.idProvince = decryptedLastNumerator[1];
                    newAddress.idCity = decryptedLastNumerator[2];
                    newAddress.idDistrict = decryptedLastNumerator[3];
                    newAddress.idUser = decryptedLastNumerator[0];
                    address.create(newAddress,security, function(message,status,data){
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
                log.address.error(err);
                response.ok('Internal Server Error', 500, null, res); 
            });
        }
    }catch(exception){
        log.address.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
};