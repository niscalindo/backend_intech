        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const categoryProduct = db.category_product;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.getAll = function(security,order, result){
    categoryProduct.findAll({
        attributes:{
            exclude: ['created_by', 'date_created']
        },
        where: {
            status:{
                [operator.eq]: '1'
            }
        },
        order: [
            ['id_category', order]
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
};

exports.find = function(security,field, result){
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "categoryName"){
            op = operator.substring;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }else{
            op = operator.eq;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }
        
    }
    let condition = new Object();
    condition[operator.eq] = '1';
    conditionKey['status'] = condition;
    
    categoryProduct.findAll({
        attributes:{
            exclude: ['created_by']
        },
        where: [conditionKey]
    }).then(data=>{
        if(data == null){
            result("Not Found", 404, null);
        }else{
            security.encrypt(data)
            .then(function(encryptedData){
                result("success", 200, encryptedData);
            }).catch(function(error){
                result(error, 500, null);
            });            
        }
    }).catch(err=>{
       result(err.message, 500, null);
    });
}

exports.create = function(newData,security, result){
    newData['status'] = '1';  
    newData['dateCreated'] = new Date();   
    categoryProduct.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            result(error,500,null);
        });        
    }).catch(err=>{
        result(err.message, 500, null);
    });
};

exports.update= function(newData, result){
    categoryProduct.update(
        newData,
        {
            where: {id_category: parseInt(newData.id)}
        }).then(function(data){
        if(data[0] == 1){
            result("success", 200, data[0]);
        }else{
            result("no changes", 200, data[0]);
        }
    })
    .catch(err=>{
        result(err.message, 500, null);
    });
};
exports.findMaxNumerator= function( result){
    categoryProduct.findOne({
        attributes:[
            [sequelize.fn('max', sequelize.col('id_category')), 'numerator']
        ],
        order: [
            ['id_category', 'desc']
        ]
    }).then(data=>{
        result("success", 200, data);
    }).catch(err=>{
        result(err.message, 500, null);
    });
}
function columnDictionary(key){
    if(key === 'id'){
        return 'id_category';
    }else if(key === 'categoryName'){
        return 'category_name';
    }else if(key === 'categoryCode'){
        return 'category_code';
    }else{
        return key;
    }
}