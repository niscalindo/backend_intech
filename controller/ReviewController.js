/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const review = require("../service/Review");
const log = require('../utils/logger');

exports.create = function(req, res){
    try{
        log.review.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newReview = req.body.review;
        if(typeof newReview=== 'undefined' || typeof newReview === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newReview.id, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newReview.id = decryptedId[0];
                        newReview.createdBy = decryptedId[1];
                        review.create(newReview, function(message,status,data){
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
                log.review.error(error);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.review.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.find = function(req, res){
    try{
        log.review.info("Controller - request from : "+req.connection.remoteAddress);
        let param = req.query;
        let scope = req.headers.scope;
        let order = req.headers.order;
        let limit = req.headers.total_data;
        let orderBy = req.headers.order_by;
        let offset = req.headers.page;
        let userCredential = req.user;
        if(typeof orderBy === 'undefined' || typeof orderBy === null){
            orderBy = 'review_date';
        }
        if(typeof order === 'undefined' || typeof order === null){
            order = 'asc';
        }
        if(typeof limit === 'undefined' || typeof limit === null){
            limit = 500;
        }

        if(typeof offset === 'undefined' || typeof offset === null){
            offset = 0;
        }else{
            if(offset >= 1){
                offset = limit * (offset-1);
            }else{
                offset = 0;
            }
        }
//        console.log(param);
//        let userData = req.user;  
        if((typeof param === 'undefined' || typeof param === null)) {
            response.ok('Bad Request', 401, null, res);
        }else{
//            let encryptedData = [userData.id];
            let encryptedData = new Array();
            let index = 0;
            if(typeof param.idProductVarian != 'undefined' && typeof param.idProductVarian != null){
                encryptedData[index] = param.idProductVarian;
                index++
            }
            if(typeof param.store != 'undefined' && typeof param.store != null){
                encryptedData[index] = userCredential.id;
            }
            security.decrypt(encryptedData)
            .then(function(data){
//                param.createdBy = data[0];
//                console.log("test : "+data[1]);
                index = 0;
                if(typeof param.idProductVarian != 'undefined' && typeof param.idProductVarian != null){
                    param.idProductVarian = data[index];
                    index++;
                }
                if(typeof param.store != 'undefined' && typeof param.store != null){
                    param.idStore = data[index];
                }
                
                review.find(security,orderBy, order,parseInt(offset), parseInt(limit),param, scope,function(message, status, data){
                    if(status == 200 || status == 201){
                        if(data == null || data == ""){
                            let resultAll = new Object();
                            resultAll.rowCount = 0;
                            resultAll.data = data;
                            response.ok('empty result', status, resultAll, res); 
                        }else{
                            review.countResult(orderBy, order,param,scope, function(messageRow, statusRow,dataRow){
                                let resultAll = new Object();
                                resultAll.rowCount = dataRow;
                                resultAll.data = data;
                                response.ok(message, status, resultAll, res);                    
                            });
//                            response.ok(message, status, data, res);                    
                        }
                    }else{
                        response.ok(message, status, null, res);            
                    }
                });
            }).catch(function(error){
                log.review.error(error);
                response.ok('Internal Server Error',500,null, res);
            });
        }
    }catch(exception){
        log.review.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}
    
    exports.countStars = function(req, res){
        try{
            log.review.info("Controller - request from : "+req.connection.remoteAddress);
            let userToken = req.user;
            let encryptedData = [userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        let idStore = decryptedId[0];
                        review.countByStars(idStore, function(message,status,data){
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
                log.review.error(error);
                response.ok('Internal Server Error',500,null, res);
            });
        }catch(exception){
            log.review.error(exception);
            response.ok('Internal Server Error',500,null, res);
        }
    }