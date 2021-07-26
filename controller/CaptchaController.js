/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const response = require("../model/response");
const captchaService = require("../service/Captcha");
const log = require('../utils/logger');

exports.create = function(req,res){
    try{
        log.captcha.info("Controller - request from : "+req.connection.remoteAddress);
        let captcha = req.body.captcha;
        captchaService.create(captcha, function(message, status, data){
            if(status == 200 || status == 201){
                if(data == null || data == ""){
                    response.ok('empty result', status, data, res); 
                }else{
                    response.ok(message, status, data, res);                    
                }
            }else{
                response.ok(message, status, null, res);            
            }
        })
    }catch(exception){
        log.captcha.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}
exports.find = function(req,res){
    try{
        log.captcha.info("Controller - request from : "+req.connection.remoteAddress);
        let guessedKey = req.query.key;
        let ipAddress = req.query.ip;
        let time = req.query.time;
        captchaService.find(ipAddress,guessedKey, time, function(message, status, data){
            if(status == 200 || status == 201){
                if(data == null || data == ""){
                    response.ok('empty result', status, data, res); 
                }else{
                    response.ok(message, status, data, res);                    
                }
            }else{
                response.ok(message, status, null, res);            
            }
        })
    }catch(exception){
        log.captcha.error(exception);
        response.ok('Internal Server Error', 500, null, res);
    }
}
