/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";
var response = require('../model/response');
var user = require('../service/User');
var security = require('../utils/Security');

exports.login = function(req, res){
    if(typeof req.body.credential === 'undefined' || typeof req.body.credential === null){
        response.ok("bad request", 401, null, res);
    }else{
        try{
            var param = req.body.credential;
            user.login(param, function(message, status, data){
                if(status == 200 || status == 201) {
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
            response.ok(exception.message, 500, null, res);
        }
    }
};
exports.find = function(req, res){
    try{
        var query = req.query;
        if(typeof req.query === 'undefined' || typeof req.query === null){
            response.ok("bad request", 401, null, res);
        }else{
            if(typeof query.id === 'undefined' || typeof query.id === null){
                user.find(query, function(message, status, data){
                    if(status == 400){
                        response.ok(message, 400, null, res);
                    }else if(status == 404){
                        response.ok(message, 404, null, res);
                    }else if(status == 200){
                        if(data == null || data == ""){
                            response.ok('empty result', 200, data, res); 
                        }else{
                            response.ok(message, 200, data, res);                    
                        }
                    }else{
                        response.ok(message, 500, null, res);            
                    }
                });
            }else{
                let encryptedData = [query.id]
                security.decrypt(encryptedData)
                .then(function(data){
                    query.id = data[0];
                    user.find(query, function(message, status, data){
                        if(status == 400){
                            response.ok(message, 400, null, res);
                        }else if(status == 200){
                            if(data == null || data == ""){
                                response.ok('empty result', 200, data, res); 
                            }else{
                                response.ok(message, 200, data, res);                    
                            }
                        }else{
                            response.ok(message, 500, null, res);            
                        }
                    });
                }).catch(function(error){
                    response.ok(error, 400, null, res); 
                });
            }            
        }
    }catch(exception){
        response.ok(exception.message, 500, null, res);        
    }
};