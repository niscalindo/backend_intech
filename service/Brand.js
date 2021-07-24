        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const brand = db.brand;
const furtherSubCategoryProduct = db.further_sub_category_product;
const subCategoryProduct = db.sub_category_product;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;
const log = require('../utils/logger');

exports.getAll = function(security,order, result){
    brand.findAll({
        attributes:{
            exclude: ['createdBy', 'dateCreated']
        },
        where: {
            status:{
                [operator.eq]: '1'
            }
        },
        order: [
            ['id_brand', order]
        ],
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            log.brand.error(error);
            result("Encryption Failed", 1000, null);
        });
    }).catch(err=>{
        log.brand.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.find = function(security,field, result){
    let parent = null;
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "parent"){
            parent = value;
        }
        if(key === "name"){
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
    let includeParent = new Object();
    if(parent === "subCategory"){
        includeParent = 
            {
                model: subCategoryProduct,
                as: 'subCategory',
                exclude: ['createdBy','dateCreated','status']
            }
    }else if(parent === "furtherSubCategory"){
        includeParent = 
            {
                model: furtherSubCategoryProduct,
                as: 'furtherSubCategory',
                exclude: ['createdBy','dateCreated','status','idSubCategory','subCategoryName','categoryName'],
                include:[
                   {
                        model: subCategoryProduct,
                        as: 'subCategory',
                        exclude: ['createdBy','dateCreated','status']
                    } 
                ]
            }
    }
    brand.findAll({
        attributes:{
            exclude: ['createdBy','dateCreated']
        },
        include:[includeParent],
        where: [conditionKey]
    }).then(data=>{
        if(data == null){
            result("Not Found", 404, null);
        }else{
            security.encrypt(data)
            .then(function(encryptedData){
                result("success", 200, encryptedData);
            }).catch(function(error){
                log.brand.error(error);
                result("Encryption Failed", 1000, null);
            });            
        }
    }).catch(err=>{
        log.brand.error(err);
        result("Internal Server Error", 500, null);
    });
}

exports.create = function(newData,security, result){
    newData['status'] = '1';  
    newData['dateCreated'] = new Date();   
    brand.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            log.brand.error(error);
            result("Encryption Failed", 1000, null);
        });        
    }).catch(err=>{
        log.brand.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.update= function(newData, result){
    brand.update(
        newData,
        {
            where: {id_brand: parseInt(newData.id)}
        }).then(function(data){
        if(data[0] == 1){
            result("success", 200, data[0]);
        }else{
            result("no changes", 1001, data[0]);
        }
    })
    .catch(err=>{
        log.brand.error(err);
        result("Internal Server Error", 500, null);
    });
};
exports.findMaxNumerator= function( result){
    brand.findOne({
        attributes:[
            [sequelize.fn('max', sequelize.col('id_brand')), 'numerator']
        ],
        order: [
            ['id_brand', 'desc']
        ]
    }).then(data=>{
        result("success", 200, data);
    }).catch(err=>{
        log.brand.error(err);
        result("Internal Server Error", 500, null);
    });
};
function columnDictionary(key){
    if(key === 'id'){
        return 'id_brand';
    }else if(key === 'idParent'){
        return 'id_parent';
    }else if(key === 'groupBy'){
        return 'parent';
    }else if(key === 'name'){
        return 'brand_name';
    }else{
        return key;
    }
}