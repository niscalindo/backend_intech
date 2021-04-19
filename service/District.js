        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const district = db.district;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.find = function(security,id, result){
    district.findAll({
        where: {
            regency_id:{
                [operator.eq]: id
            }
        },
        order: [
            ['name', 'asc']
        ],
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            result(error, 500, null);
        });
    }).catch(err=>{
       result(err.message, 500, null);
    });
}

exports.getById = function(security,id, result){
    district.findAll({
        where: {
            id:{
                [operator.eq]: id
            }
        },
        order: [
            ['name', 'asc']
        ],
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            result(error, 500, null);
        });
    }).catch(err=>{
       result(err.message, 500, null);
    });
}