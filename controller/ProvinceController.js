/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict"
const response = require("../model/response");
const security = require("../utils/Security");
const province = require("../service/Province");
const log = require('../utils/logger');

exports.getAll = function(req, res){
    try{
        log.province.info("Controller - request from : "+req.connection.remoteAddress);
        province.getAll(security,function(message, status,data){
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
        log.province.error(exception);
        response.ok('Internal Server Error',500,null, res);
    }
}