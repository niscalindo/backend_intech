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
    let condition = new Object();
    if(id != null){
        let whereCondition = {
            province_id:{
                [operator.eq]: id
            }
        }
        condition['where']=whereCondition;
    }else{
        condition['include']=[{
            model:db.province,
            as:'province'
        }];
    }
    condition['order']=[
            ['name', 'asc']
        ];
    regency.findAll(condition).then(data=>{
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