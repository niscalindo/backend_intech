        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const regency = db.regency;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.find = function(security,id, result){
    regency.findAll({
        where: {
            province_id:{
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