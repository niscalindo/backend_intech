/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const promo = require("../service/Promo");

exports.getAll = function(req, res){
    try{
        let order = req.headers.order;
        let userToken = req.user;
        let param = req.query;
        if(typeof order === 'undefined' && typeof order === null){
            order = 'desc';
        }else{
            if(order !== 'asc' && order !== 'desc'){
                order = 'desc';
            }
        }
        
        if((typeof param === 'undefined' || typeof param === null) || (typeof param.source === 'undefined' || typeof param.source === null)) {
            response.ok('Bad Request', 401, null, res);
        }else{
            if(param.source == "admin" && userToken.role != "admin"){
                response.ok('Not Allowed', 403, null, res);
                return;
            }
            let encryptedData = [userToken.id];
            let index = 1;
            if(param.idPromo != "undefined" && param.idPromo != null){
               encryptedData[index] = param.idPromo;
            }
            security.decrypt(encryptedData)
                .then(function(decryptedData){
                 index = 1;  
                if(param.idPromo != "undefined" && param.idPromo != null){
                   param.idPromo = decryptedData[1];
                }
                promo.find(security,order,param.source, decryptedData[0],param,function(message, status,data){
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
            });
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

exports.create = function(req, res){
    try{
        let userToken = req.user;
        let newPromo = req.body.promo;
        if((typeof newPromo === 'undefined' || typeof newPromo === null)){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id];
            let index = 1;
            let isDetailValid = true;
            if(typeof newPromo.details != 'undefined' && typeof newPromo.details != null){
                for (let i = 0; i < newPromo.details.length; i++) {
                    if(typeof newPromo.details[i].idProductVarian != 'undefined' && typeof newPromo.details[i].idProductVarian != null){
                        encryptedData[index] = newPromo.details[i].idProductVarian;
                        index++;
                    }else{
                        isDetailValid = false;
                        break;
                    }
                }
            }
            if(!isDetailValid){
                response.ok('Bad Request', 401, null, res);
                return;
            }
            promo.findMaxNumerator(function(message, status, numerator){
                if(status == 400){
                    response.ok(message, 400, null, res);
                }else if(status == 200){
                    if(numerator == null || numerator == ""){
                        response.ok('failed to generate code', 400, numerator, res); 
                    }else{
                        security.decrypt(encryptedData)
                            .then(function(decryptedData){
                                newPromo.code = generateCode(numerator.dataValues.numerator);
                                newPromo.createdBy = decryptedData[0];
                                index = 1;
                                if(typeof newPromo.details != 'undefined' && typeof newPromo.details != null){
                                    for (let i = 0; i < newPromo.details.length; i++) {
                                        newPromo.details[i].idParticipant = decryptedData[0]; //if request contain details, it must be from user
                                        newPromo.details[i].idProductVarian = decryptedData[index];
                                        index++;
                                    }
                                }
                                promo.create(newPromo,security, function(message,status,data){
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
                }
            });
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
    }
}

//exports.update = function(req, res){
//    try{
//        let userToken = req.user;
//        let newBrand = req.body.brand;
//        if(typeof newBrand === 'undefined' || typeof newBrand === null){
//            response.ok('Bad Request', 401, null, res);
//        }else{
//            let encryptedData = [newBrand.id, userToken.id, newBrand.idParent];
//            security.decrypt(encryptedData)
//                    .then(function(decryptedId){
//                        newBrand.id = decryptedId[0];
//                        newBrand.createdBy = decryptedId[1];
//                        newBrand.idParent = decryptedId[2];
//                        brand.update(newBrand, function(message,status,data){
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
//        let param = req.query;
//        if((typeof param === 'undefined' || typeof param === null) || (typeof param.parent === 'undefined' || typeof param.parent === null)) {
//            response.ok('Bad Request', 401, null, res);
//        }else{
//            if((typeof param.id === 'undefined' || typeof param.id === null) && (typeof param.idParent === 'undefined' || typeof param.idParent === null)){
//                brand.find(security,param, function(message, status, data){
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
//                let encryptedData = new Array();
//                let index = 0;
//                if(typeof param.id != 'undefined' && typeof param.id != null){
//                    encryptedData[index] = param.id;
//                    index++;
//                }
//                if(typeof param.idParent != 'undefined' && typeof param.idParent != null){
//                    encryptedData[index] = param.idParent;
//                }
//                security.decrypt(encryptedData)
//                .then(function(data){
//                    index = 0;
//                    if(typeof param.id != 'undefined' && typeof param.id != null){
//                        param.id = data[index];
//                        index++;
//                    }
//                    if(typeof param.idParent != 'undefined' && typeof param.idParent != null){
//                        param.idParent = data[index];
//                    }
//                    brand.find(security,param, function(message, status, data){
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

function generateCode(lastNumerator){
    if (typeof lastNumerator === 'undefined' || typeof lastNumerator === null ) {
        lastNumerator = 0;
    }
    lastNumerator++;
    if (lastNumerator < 10) {
        lastNumerator = "0000" + lastNumerator;
    } else if (lastNumerator >= 10 && lastNumerator < 100) {
        lastNumerator = "000" + lastNumerator;
    } else if (lastNumerator >= 100 && lastNumerator < 1000) {
        lastNumerator = "00" + lastNumerator;
    } else if (lastNumerator >= 1000 && lastNumerator < 10000) {
        lastNumerator = "0" +lastNumerator;
    } else if (lastNumerator >= 10000 && lastNumerator < 100000) {
        lastNumerator = "" +lastNumerator;
    }
    return "PRM-" + lastNumerator;
}