/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const productService = require("../service/Product");

exports.create = function(req, res){
    let data = req.body.product;
    let userToken = req.user;
    if(typeof data.idSubCategory === 'undefined' || typeof data.idSubCategory === null){
        response.ok('Bad Request', 401, null, res);
    }
    let encryptedData = [data.idSubCategory, userToken.id];
    if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
        encryptedData[2] = data.idFurtherSubCategory;
    }
    security.decrypt(encryptedData)
    .then(function(decryptedData){
        data.idSubCategory = decryptedData[0];
        data.createdBy = decryptedData[1];
        if(data.idFurtherSubCategory != 'undefined' && data.idFurtherSubCategory != null){
           data.idFurtherSubCategory = decryptedData[2];
        }
        productService.create(data,security, function(message,status,data){
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
        response.ok('failed to decrypt code:'+err, 500, null, res); 
    });        
}