/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const captchaModel = db.captcha;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;
//
//exports.get = function(result){
//    
//}

exports.create = function(newData, result){
    newData['dateCreated'] = new Date();   
    captchaModel.create(newData).then(data=>{
        result("success",201,null);       
    }).catch(err=>{
        result(err.message, 500, null);
    });
};

exports.find = function(ipAddress, key, time, result){
    captchaModel.findOne({
        attributes:{
            exclude: ['created_by','date_created','id_district','district_name','user_password']
        },
        where: {
            ip_address:{
                [operator.eq]: ipAddress
            },
            key:{
                [operator.eq]: key
            }
        }
    }).then(data=>{
        if(data !== null){
            let dataTime = parseInt(data.dataValues.time);
            if(dataTime > time){
                let deleteData = new Object();
                deleteData.ip = ipAddress;
                deleteData.key = key;
                deleteCaptcha('match',deleteData, result);
                deleteCaptcha('old',null, result);
                result("Captcha Match", 202, data);
            }else{
                result("Expired", 403, null);
            }
        }else{
            result("Not Found", 404, null);
        }
    }).catch(err=>{
       result(err.message, 500, null);
    });
}

function deleteCaptcha(condition, data, result){
    let conditionKey = new Object();
    let timeInSeconds = new Date().getTime() / 1000;
    let tenMinutesAgo = timeInSeconds - 600;
    if(condition == 'old'){
        let condition = new Object();
        condition[operator.lt] = tenMinutesAgo;
        conditionKey['time'] = condition;
    }else{
        let condition = new Object();
        condition[operator.eq] = data.key;
        conditionKey['key'] = condition;
        let condition2 = new Object();
        condition2[operator.eq] = data.ip;
        conditionKey['ip_address'] = condition2; 
    }
    captchaModel.destroy({
        where: [conditionKey]
    }).then(data=>{
        console.log("delete captcha success");
//        result("success", 200, null);
    }).catch(err=>{
        console.log(err.message);
//        result(err.message, 500, null);
    });
}