/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const order = require("../service/Order");

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
        let userToken = req.user;
        let newOrder = req.body.order;
//        console.log(newOrder);
        if((typeof newOrder === 'undefined' || typeof newOrder === null) 
                || (typeof newOrder.stores === 'undefined' || typeof newOrder.stores === null)
                ){
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userToken.id];
            let index = 1;
            let isProductExist = true;
            for(let i=0; i<newOrder.stores.length; i++){
                console.log(newOrder.stores[i].idStore);
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
                            console.log(decryptedData[index]);
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
                    response.ok('Error occured :'+err, 500, null, res); 
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

exports.find = function(req, res){
    try{
        let param = req.query;
        let scope = req.headers.scope;
//        console.log(param);
        let userData = req.user;  
        if((typeof param === 'undefined' || typeof param === null)) {
            response.ok('Bad Request', 401, null, res);
        }else{
            let encryptedData = [userData.id];
            let index = 1;
            if(typeof param.idOrder != 'undefined' && typeof param.idOrder != null){
                encryptedData[index] = param.idOrder;
            }
            security.decrypt(encryptedData)
            .then(function(data){
                param.createdBy = data[0];
//                console.log("test : "+data[1]);
                if(typeof param.idOrder != 'undefined' && typeof param.idOrder != null){
                    param.idOrder = data[1];
                }
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
            }).catch(function(error){
                response.ok(error, 400, null, res); 
            });
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);
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