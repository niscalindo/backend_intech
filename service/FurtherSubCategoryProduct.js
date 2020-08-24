        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const furtherSubCategoryProduct = db.further_sub_category_product;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.getAll = function(security,order, result){
    furtherSubCategoryProduct.findAll({
        attributes:{
            exclude: ['createdBy', 'dateCreated']
        },
        where: {
            status:{
                [operator.eq]: '1'
            }
        },
        order: [
            ['id_further_sub_category', order]
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
        if(key === "categoryName" || key === "subCategoryName" || key === "furtherSubCategoryName"  ){
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
    
    furtherSubCategoryProduct.findAll({
        attributes:{
            exclude: ['createdBy']
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
    furtherSubCategoryProduct.create(newData).then(data=>{
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
    furtherSubCategoryProduct.update(
        newData,
        {
            where: {id_sub_category: parseInt(newData.id)}
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
    furtherSubCategoryProduct.findOne({
        attributes:[
            [sequelize.fn('max', sequelize.col('id_further_sub_category')), 'numerator']
        ],
        order: [
            ['id_further_sub_category', 'desc']
        ]
    }).then(data=>{
        result("success", 200, data);
    }).catch(err=>{
        result(err.message, 500, null);
    });
}
function columnDictionary(key){
    if(key === 'id'){
        return 'id_further_sub_category';
    }else if(key === 'idSubCategory'){
        return 'id_sub_category';
    }else if(key === 'subCategoryName'){
        return 'sub_category_name';
    }else if(key === 'furtherSubCategoryCode'){
        return 'further_sub_category_code';
    }else if(key === "furtherSubCategoryName"){
        return 'further_sub_category_name';
    }else{
        return key;
    }
}