/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const order = require("../service/Order");
const log = require('../utils/logger');

//exports.getAll = function(req, res){
//    try{
//        let order = req.headers.order;
//        if(typeof order === 'undefined' && typeof order === null){
//            order = 'desc';
//        }else{
//            if(order !== 'asc' && order !== 'desc'){
//                order = 'desc';
//            }
//        }
//        brand.getAll(security,order,function(message, status,data){
//            if(status == 200 || status == 201){
//                if(data == null || data == ""){
//                    response.ok('empty result', status, data, res); 
//                }else{
//                    response.ok(message, status, data, res);                    
//                }
//            }else{
//                response.ok(message, status, null, res);            
//            }
//        });
//    }catch(exception){
//        response.ok(exception.message, 500, null, res);
//    }
//}

exports.create = function(req, res){
    try{
        log.order.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newOrder = req.body.order;
//        console.log(newOrder);
        if((typeof newOrder === 'undefined' || typeof newOrder === null) 
                || (typeof newOrder.stores === 'undefined' || typeof newOrder.stores === null)
                ){
            response.ok('Bad Request', 401, null, res);
        }else{
            newOrder.invoice = generateInvoice(userToken.id);
            let encryptedData = [userToken.id];
            let index = 1;
            let isProductExist = true;
            for(let i=0; i<newOrder.stores.length; i++){
                encryptedData[index]=newOrder.stores[i].idStore;
                index++;
                if(typeof newOrder.stores[i].products === "undefined" || typeof newOrder.stores[i].products === null){
                    isProductExist = false;
                    break;
                }else{
                    for(let j=0; j<newOrder.stores[i].products.length; j++){
                        encryptedData[index]=newOrder.stores[i].products[j].idProductVarian;
                        index++;
//                        console.log('product : '+newOrder.stores[i].products[j].idProductVarian);
                    }
                }
            }
            if(isProductExist){
                security.decrypt(encryptedData)
                    .then(function(decryptedData){
                        newOrder.createdBy=decryptedData[0];
                        index = 1;
                        for(let i=0; i<newOrder.stores.length; i++){
                            newOrder.stores[i].idStore = decryptedData[index];
                            index++;
                            for(let j=0; j<newOrder.stores[i].products.length; j++){
                                newOrder.stores[i].products[j].idProductVarian = decryptedData[index];
                                index++;
//                                console.log('product name :'+newOrder.stores[i].products[j].productName+' : '+newOrder.stores[i].products[j].idProductVarian);
                            }
                        }
                        order.create(newOrder,security, function(message,status,data){
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
                    log.order.error(err);
                    response.ok('Internal Server Error',500,null, res);
                });
            }else{
                response.ok('Bad Request', 401, null, res);
            }
//            brand.findMaxNumerator(function(message, status, numerator){
//                if(status == 400){
//                    response.ok(message, 400, null, res);
//                }else if(status == 200){
//                    if(numerator == null || numerator == ""){
//                        response.ok('failed to generate code', 400, numerator, res); 
//                    }else{
//                        security.decrypt(encryptedData)
//                            .then(function(decryptedLastNumerator){
//                                newBrand.code = generateCode(numerator.dataValues.numerator);
//                                newBrand.createdBy = decryptedLastNumerator[0];
//                                newBrand.idParent = decryptedLastNumerator[1];
//                                brand.create(newBrand,security, function(message,status,data){
//                                    if(status == 200 || status == 201){
//                                        if(data == null || data == ""){
//                                            response.ok('empty result', status, data, res); 
//                                        }else{
//                                            response.ok(message, status, data, res);                    
//                                        }
//                                    }else{
//                                        response.ok(message, status, null, res);            
//                                    }
//                                });
//                        }).catch(function(err){
//                            response.ok('failed to generate code :'+err, 500, null, res); 
//                        });
//                        
//                    }
//                }
//            });
        }
    }catch(exception){
        log.order.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}

exports.update = function(req, res){
    try{
        log.order.info("Controller - request from : "+req.connection.remoteAddress);
        let userToken = req.user;
        let newOrder = req.body.order;
        if(typeof newOrder === 'undefined' || typeof newOrder === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [newOrder.id, userToken.id];
            security.decrypt(encryptedData)
                    .then(function(decryptedId){
                        newOrder.id = decryptedId[0];
                        newOrder.createdBy = decryptedId[1];
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
        if(typeof mode === 'undefined' || typeof mode === null){
            mode = 'read';
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
                index++
            }
            if(typeof param.idProductVarian != 'undefined' && typeof param.idProductVarian != null){
                encryptedData[index] = param.idProductVarian;
                index++
            }
            if(typeof param.idOrderStore != 'undefined' && typeof param.idOrderStore != null){
                encryptedData[index] = param.idOrderStore;
                index++
            }
            security.decrypt(encryptedData)
            .then(function(data){
                param.createdBy = data[0];
//                console.log("test : "+data[1]);
                index=1;
                if(typeof param.idOrder != 'undefined' && typeof param.idOrder != null){
                    param.idOrder = data[index];
                    index++;
                }
                if(typeof param.idProductVarian != 'undefined' && typeof param.idProductVarian != null){
                    param.idProductVarian = data[index];
                    index++;
                }
                if(typeof param.idOrderStore != 'undefined' && typeof param.idOrderStore != null){
                    param.idOrderStore = data[index];
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
                    order.find(security,param, scope,function(message, status, data){
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
        
function generateInvoice(id){
    let today = new Date();
    let invoice = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate();
    invoice = invoice +""+today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
    invoice = invoice +""+id.substring(0, 5);
    return invoice.toUpperCase();
}
