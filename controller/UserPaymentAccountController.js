/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const userPaymentAccount = require("../service/UserPaymentAccount");

exports.getAll = function(req, res){
    try{
        let headers = req.headers;
        let userData = req.user;
        let encryptedData = [userData.id];
        security.decrypt(encryptedData)
                .then(function(decryptedId){
            userPaymentAccount.getAll(security,decryptedId[0],function(message, status,data){
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
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}
exports.create = function(req, res){
    try{
        let userData = req.user;
        let newPaymentAccount = req.body.paymentAccount;
        if(typeof newPaymentAccount=== 'undefined' || typeof newPaymentAccount === null){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userData.id];
            security.decrypt(encryptedData)
                .then(function(decryptedData){
                    newPaymentAccount ['idUser'] = decryptedData[0];
                    newPaymentAccount ['createdBy'] = decryptedData[0];
                    userPaymentAccount.create(newPaymentAccount,security, function(message,status,data){
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
//
//exports.update = function(req, res){
//    try{
//        let newCategory = req.body.category;
//        if(typeof newCategory === 'undefined' || typeof newCategory === null){
//            response.ok('Bad Request', 401, null, res);
//        }else{
//            let encryptedData = [newCategory.id, newCategory.createdBy];
//            security.decrypt(encryptedData)
//                    .then(function(decryptedId){
//                        newCategory.id = decryptedId[0];
//                        newCategory.createdBy = decryptedId[1];
//                        categoryProduct.update(newCategory, function(message,status,data){
//                            if(status == 200 || status == 201){
//                                if(data == null || data == ""){
//                                    response.ok('empty result', status, data, res); 
//                                }else{
//                                    response.ok(message, status, data, res);                    
//                                }
//                            }else{
//                                response.ok(message, status, null, res);            
//                            }
//                        });
//            }).catch(function (error){
//                response.ok("data not found : "+error, 500, null, res);   
//            });
//        }
//    }catch(exception){
//        response.ok(exception.message, 500, null, res);
//    }
//}
//
//exports.find = function(req, res){
//    try{
//        let scope = req.headers.scope_all;
//        console.log(scope);
//        if(typeof scope === 'undefined' || typeof scope === null){
//            scope = false;
//        }
//        let param = req.query;
//        if(typeof param === 'undefined' || typeof param === null){
//            response.ok('Bad Request', 401, null, res);
//        }else{
//            if(typeof param.id === 'undefined' || typeof param.id === null){
//                categoryProduct.find(security,param,scope, function(message, status, data){
//                    if(status == 200 || status == 201){
//                        if(data == null || data == ""){
//                            response.ok('empty result', status, data, res); 
//                        }else{
//                            response.ok(message, status, data, res);                    
//                        }
//                    }else{
//                        response.ok(message, status, null, res);            
//                    }
//                });
//            }else{
//                let encryptedData = [param.id];
//                security.decrypt(encryptedData)
//                .then(function(data){
//                    param.id = data;
//                    categoryProduct.find(security,param, function(message, status, data){
//                        if(status == 200 || status == 201){
//                            if(data == null || data == ""){
//                                response.ok('empty result', status, data, res); 
//                            }else{
//                                response.ok(message, status, data, res);                    
//                            }
//                        }else{
//                            response.ok(message, status, null, res);            
//                        }
//                    });
//                }).catch(function(error){
//                    response.ok(error, 400, null, res); 
//                });
//            }
//        }
//    }catch(exception){
//        response.ok(exception.message, 500, null, res);
//    }
//}
//
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
//    return "CAT-" + lastNumerator;
//}
