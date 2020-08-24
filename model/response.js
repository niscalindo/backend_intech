/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

exports.ok = function(message,status,data, res){
    let response = null;
    if(data == null){
        response = {
            'status': status,
            'message': message,
            'data':null
        };
    }else{
       response = {
            'status': status,
            'message': message,
            'data':data
        }; 
    }
    res.json(response);
    res.end();
};


