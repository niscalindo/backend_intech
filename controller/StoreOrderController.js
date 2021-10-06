/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const order = require("../service/StoreOrder");
const log = require('../utils/logger');

exports.update = function(req, res){
    try{
        log.order.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newOrder = req.body.orderStore;
        if(typeof newOrder === 'undefined' || typeof newOrder === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newOrder.idOrderStore];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newOrder.idOrderStore = decryptedId[0];
                        order.update(newOrder, function(message,status,data){
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
                log.order.error(error);
                response.ok('Internal Server Error',500,null, res); 
            });
        }
    }catch(exception){
        log.order.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}
exports.updateReview = function(req, res){
    try{
        log.order.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let review = req.body.review;
        if(typeof review=== 'undefined' || typeof review === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [review.id, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        review.id = decryptedId[0];
                        review.createdBy = decryptedId[1];
                        order.updateReview(review, function(message,status,data){
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
                log.order.error(error);
                response.ok('Internal Server Error',500,null, res); 
            });
        }
    }catch(exception){
        log.order.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}
exports.find = function(req, res){
    try{
        log.order.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        let scope = req.headers.scope;
        let mode = req.headers.mode;
        let orderBy = req.headers.order_by;
        let sort = req.headers.order;
        if(typeof sort === 'undefined' || typeof sort === null){
            sort = 'desc';
        }
        if(typeof mode === 'undefined' || typeof mode === null){
            mode = 'read';
        }
        if(typeof orderBy === 'undefined' || typeof orderBy === null){
            orderBy = 'id_order';
        }
//        console.log(param);
        let userData = req.user;  
        if((typeof param === 'undefined' || typeof param === null)) {
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userData.id];
            let index = 1;
            if(typeof param.idOrder != 'undefined' && typeof param.idOrder != null){
                encryptedData[index] = param.idOrder;
                index++;
            }
            if(typeof param.idProductVarian != 'undefined' && typeof param.idProductVarian != null){
                encryptedData[index] = param.idProductVarian;
            }
            security.decrypt(encryptedData)
            .then(function(data){
                param.idStore = data[0];
//                console.log("test : "+data[1]);
                index=1;
                if(typeof param.idOrder != 'undefined' && typeof param.idOrder != null){
                    param.idOrder = data[index];
                    index++;
                }
                if(typeof param.idProductVarian != 'undefined' && typeof param.idProductVarian != null){
                    param.idProductVarian = data[index];
                }
                if(mode=="count"){
                    order.countSelling(param, scope,function(message, status, data){
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
                    order.find(security,param,sort,orderBy, scope,function(message, status, data){
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
            }).catch(function(error){
                log.order.error(error);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.order.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

//function generateCode(lastNumerator){
//    if (typeof lastNumerator === 'undefined' || typeof lastNumerator === null ) {
//        lastNumerator = 0;
//    }
//    lastNumerator++;
//    if (lastNumerator < 10) {
//        lastNumerator = "000" + lastNumerator;
//    } else if (lastNumerator >= 10 && lastNumerator < 100) {
//        lastNumerator = "00" + lastNumerator;
//    } else if (lastNumerator >= 100 && lastNumerator < 1000) {
//        lastNumerator = "0" + lastNumerator;
//    } else if (lastNumerator >= 1000 && lastNumerator < 10000) {
//        lastNumerator = "" +lastNumerator;
//    }
//    return "BRN-" + lastNumerator;
//}