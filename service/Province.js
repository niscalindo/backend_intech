        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const province = db.province;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;
const log = require('../utils/logger');

exports.getAll = function(security, result){
    province.findAll({
        order: [
            ['name', 'asc']
        ],
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            log.province.error(error);
            result("Encryption Failed", 1000, null);
        });
    }).catch(err=>{
        log.province.error(err);
        result("Internal Server Error", 500, null);
    });
};