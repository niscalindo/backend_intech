/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const delivery = require("../service/Delivery");
const log = require('../utils/logger');

// exports.getAll = function(req, res){
//     try{
//         let order = req.headers.order;
//         if(typeof order === 'undefined' && typeof order === null){
//             order = 'desc';
//         }else{
//             if(order !== 'asc' && order !== 'desc'){
//                 order = 'desc';
//             }
//         }
//         delivery.getAll(security,order,function(message, status,data){
//             if(status == 200 || status == 201){
//                 if(data == null || data == ""){
//                     response.ok('empty result', status, data, res); 
//                 }else{
//                     response.ok(message, status, data, res);                    
//                 }
//             }else{
//                 response.ok(message, status, null, res);            
//             }
//         });
//     }catch(exception){
//         response.ok(exception.message, 500, null, res);
//     }
// }

exports.getAll = function(req, res){
    try{
        log.delivery.info("Controller - request from : "+req.connection.remoteAddress);
        let headers = req.headers;
        let userData = req.user;
        let encryptedData = [userData.id];
        security.decrypt(encryptedData)
                .then(function(decryptedId){
                delivery.getAll(security,decryptedId[0],function(message, status,data){
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
            log.delivery.error(error);
            response.ok("Internal Server Error", 500, null, res);
        });
    }catch(exception){
        log.delivery.error(exception);
        response.ok("Internal Server Error", 500, null, res);
    }
}

exports.create = function(req, res){
    try{
        log.delivery.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newDelivery = req.body.delivery;
        if(typeof newDelivery === 'undefined' || typeof newDelivery === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id, newDelivery.idCourier];
            
            security.decrypt(encryptedData)
                .then(function(decryptedLastNumerator){
                    newDelivery['createdBy'] = decryptedLastNumerator[0];
                    newDelivery['idCourier'] = decryptedLastNumerator[1];
                    delivery.create(newDelivery,security, function(message,status,data){
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
                log.delivery.error(err);
                response.ok("Internal Server Error", 500, null, res);
            });
        }
    }catch(exception){
        log.delivery.error(exception);
        response.ok("Internal Server Error", 500, null, res);
    }
}

exports.update = function(req, res){
    try{
        log.delivery.info("Controller - request from : "+req.connection.remoteAddress);
        let newDelivery = req.body.delivery;
        if(typeof newDelivery === 'undefined' || typeof newDelivery === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newDelivery.id];
            security.decrypt(encryptedData)
            .then(function(decryptedId){
                console.log(decryptedId)
                        newDelivery.id = decryptedId[0];
                        // newDelivery.createdBy = decryptedId[0];
                        delivery.update(newDelivery, function(message,status,data){
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
                log.delivery.error(error);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.delivery.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.find = function(req, res){
    try{
        log.delivery.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        if(typeof param === 'undefined' || typeof param === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            if(typeof param.id === 'undefined' || typeof param.id === null){
                delivery.find(security,param, function(message, status, data){
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
                    delivery.find(security,param, function(message, status, data){
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
                    log.delivery.error(error);
                    response.ok('Internal Server Error',500,null, res); 
                });
            }
        }
    }catch(exception){
        log.delivery.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}
