/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const slider = require("../service/Slider");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.slider.info("Controller - request from : "+req.connection.remoteAddress);
        let order = req.headers.order;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        slider.getAll(security,order,function(message, status,data){
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
        log.slider.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.create = function(req, res){
    try{
        log.slider.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newSlider = req.body.slider;
        if(typeof newSlider === 'undefined' || typeof newSlider === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id];
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newSlider['createdBy'] = decryptedLastNumerator[0];
                    slider.create(newSlider,security, function(message,status,data){
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
                log.slider.error(err);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.slider.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.update = function(req, res){
    try{
        log.slider.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newSlider = req.body.slider;
        if(typeof newSlider === 'undefined' || typeof newSlider === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newSlider.id, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newSlider.id = decryptedId[0];
                        newSlider.createdBy = decryptedId[1];
                        slider.update(newSlider, function(message,status,data){
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
                log.slider.error(error);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.slider.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.find = function(req, res){
    try{
        log.slider.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.id === 'undefined' || typeof param.id === null){
                slider.find(security,param, function(message, status, data){
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
                let encryptedData = [param.id];
                security.decrypt(encryptedData)
                .then(function(data){
                    param.id = data;
                    slider.find(security,param, function(message, status, data){
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
                    log.slider.error(error);
                    response.ok('Internal Server Error',500,null, res);
                });
            }
        }
    }catch(exception){
        log.slider.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}
