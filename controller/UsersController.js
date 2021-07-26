/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
var response = require('../model/response');
var users = require('../service/Users');
var security = require('../utils/Security');
const log = require('../utils/logger');

exports.login = function(req, res){
    log.users.info("Controller - request from : "+req.connection.remoteAddress);
    if(typeof req.body.credential === 'undefined' || typeof req.body.credential === null){
        response.ok("bad request", 401, null, res);
    }else{
        try{
            var param = req.body.credential;
            users.login(param, function(message, status, data){
                if(status == 200 || status == 201) {
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
            log.users.error(exception);
            response.ok('Internal Server Error',500,null);
        }
    }
};
exports.find = function(req, res){
    try{
        log.users.info("Controller - request from : "+req.connection.remoteAddress);
        var query = req.query;
        if(typeof req.query === 'undefined' || typeof req.query === null){
            response.ok("bad request", 401, null, res);
        }else{
            if(typeof query.id === 'undefined' || typeof query.id === null){
                users.find(query, function(message, status, data){
                    if(status == 400){
                        response.ok(message, 400, null, res);
                    }else if(status == 404){
                        response.ok(message, 404, null, res);
                    }else if(status == 200){
                        if(data == null || data == ""){
                            response.ok('empty result', 200, data, res); 
                        }else{
                            response.ok(message, 200, data, res);                    
                        }
                    }else{
                        response.ok(message, 500, null, res);            
                    }
                });
            }else{
                let encryptedData = [query.id]
                security.decrypt(encryptedData)
                .then(function(data){
                    query.id = data[0];
                    users.find(query, function(message, status, data){
                        if(status == 400){
                            response.ok(message, 400, null, res);
                        }else if(status == 200){
                            if(data == null || data == ""){
                                response.ok('empty result', 200, data, res); 
                            }else{
                                response.ok(message, 200, data, res);                    
                            }
                        }else{
                            response.ok(message, 500, null, res);            
                        }
                    });
                }).catch(function(error){
                        log.users.error(error);
                        response.ok('Internal Server Error',500,null);
                });
            }            
        }
    }catch(exception){
        log.users.error(exception);
        response.ok('Internal Server Error',500,null);      
    }
};

exports.update = function(req, res){
    try{
        log.users.info("Controller - request from : "+req.connection.remoteAddress);
        let newUser = req.body.user;
        let userToken = req.user;
        if((typeof newUser === 'undefined' || typeof newUser === null) || (typeof newUser.id === 'undefined' || typeof newUser.id === null)){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newUser.id, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newUser.id = decryptedId[0];
                        newUser.createdBy = decryptedId[1];
                        users.update(newUser, function(message,status,data){
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
                log.users.error(error);
                response.ok('Internal Server Error',500,null);
            });
        }
    }catch(exception){
        log.users.error(exception);
        response.ok('Internal Server Error',500,null);
    }
};

exports.addVerificationCode = function(req, res){
    try{
        log.users.info("Controller - request from : "+req.connection.remoteAddress);
        let newUser = req.body.user;
        let userToken = req.user;
        if(typeof newUser === 'undefined' || typeof newUser === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(newUser.length > 2 && newUser.length == 1){
                response.ok('Bad Request', 401, null, res);
            }else{
                if(typeof newUser.serialNumber === 'undefined' || typeof newUser.serialNumber === null){
                    response.ok('Bad Request', 401, null, res);
                }else{
                    let encryptedData = [newUser.id];
                    security.decrypt(encryptedData)
                            .then(function(decryptedId){
                                newUser.id = decryptedId[0];
                                newUser.createdBy = decryptedId[0];
                                users.update(newUser, function(message,status,data){
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
                        log.users.error(error);
                        response.ok('Internal Server Error',500,null);   
                    });
                }
            }
        }
    }catch(exception){
        log.users.error(exception);
        response.ok('Internal Server Error',500,null);
    }
};

exports.findVerificationCode = function(req, res){
    try{
        log.users.info("Controller - request from : "+req.connection.remoteAddress);
        let newUser = req.query;
        if(typeof newUser === 'undefined' || typeof newUser === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(newUser.length > 2 && newUser.length == 1){
                response.ok('Bad Request', 401, null, res);
            }else{
                if(typeof newUser.serialNumber === 'undefined' || typeof newUser.serialNumber === null){
                    response.ok('Bad Request', 401, null, res);
                }else{
                    let encryptedData = [newUser.id];
                    security.decrypt(encryptedData)
                            .then(function(decryptedId){
                                newUser.id = decryptedId[0];
                                users.find(newUser, function(message,status,data){
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
                        log.users.error(error);
                        response.ok('Internal Server Error',500,null);  
                    });
                }
            }
        }
    }catch(exception){
        log.users.error(exception);
        response.ok('Internal Server Error',500,null);
    }
};