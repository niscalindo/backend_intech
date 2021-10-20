        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const userVerification = db.user_verification;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;
const log = require('../utils/logger');

exports.find = function(security,field, result){
    
    userVerification.findOne({
        where: [
            {
                code_confirmation:{
                    [operator.eq]: field.code
                }
            }
        ]
    }).then(data=>{
        if(data == null){
            result("Not Found", 404, null);
        }else{
            let dataVerification = JSON.parse(JSON.stringify(data));
            db.users.update(
                {status: '1'},
                {
                    where: {id_user: parseInt(dataVerification.idUser)}
            }).then(function(data){
                if(data[0] == 1){
                    userVerification.destroy({
                        where: {id_user: parseInt(dataVerification.idUser)}
                    }).then(data=>{
                        log.userVerification.info("delete varification success");
                        result("success", 200, 1);
                    }).catch(err=>{
                        log.userVerification.error(err);
                        result("Internal Server Error", 500, null);
                //        result(err.message, 500, null);
                    });
                }else{
                    result("no changes", 1001, data[0]);
                }
            }).catch(err=>{
                log.userVerification.error(err);
                result("Internal Server Error", 500, null);
            });
        }
    }).catch(err=>{
        log.userVerification.error(err);
        result("Internal Server Error", 500, null);
    });
}

exports.create = function(newData,security, result){
    userVerification.create(newData).then(data=>{
        result("success",201,1);
    }).catch(err=>{
        log.userVerification.error(err);
        result("Internal Server Error", 500, null);
    });
};