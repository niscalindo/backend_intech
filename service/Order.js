        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const order = db.order;
const detailOrderStore = db.detailOrderStore;
const detailOrderProduct = db.detailOrderProduct;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

//exports.getAll = function(security,order, result){
//    brand.findAll({
//        attributes:{
//            exclude: ['createdBy', 'dateCreated']
//        },
//        where: {
//            status:{
//                [operator.eq]: '1'
//            }
//        },
//        order: [
//            ['id_brand', order]
//        ],
//    }).then(data=>{
//        security.encrypt(data)
//        .then(function(encryptedData){
//            result("success", 200, encryptedData);
//        }).catch(function(error){
//            result(error, 500, null);
//        });
//    }).catch(err=>{
//       result(err.message, 500, null);
//    });
//};

exports.find = function(security,field,scope, result){
    let parent = null;
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "productName"){
            op = operator.substring;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }else{
            op = operator.eq;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }
    }
    if(field.status === 'undefined' || field.status === null){
        op = operator.ne;
        condition[op] = '0';
        conditionKey['status'] = condition;
    }
    let conditionObject = {
        where: [conditionKey]
    }
    if(scope!= "null" && scope == "all"){
        conditionObject.include={
            model: db.detailOrderStore,
            as: 'stores',
            include:{
                model: db.detailOrderProduct,
                as: 'products'
            }
        }
    }
    order.findAll(conditionObject).then(data=>{
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
    order.create(newData,{
        include:[{
                association: order.associations.stores,
                include:[{
                        association: detailOrderStore.associations.products
                }]
        }]
    }).then(data=>{
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
    order.update(
        newData,
        {
            where: {id_order: parseInt(newData.id)}
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
//exports.findMaxNumerator= function( result){
//    brand.findOne({
//        attributes:[
//            [sequelize.fn('max', sequelize.col('id_brand')), 'numerator']
//        ],
//        order: [
//            ['id_brand', 'desc']
//        ]
//    }).then(data=>{
//        result("success", 200, data);
//    }).catch(err=>{
//        result(err.message, 500, null);
//    });
//};
function columnDictionary(key){
    if(key === 'createdBy'){
        return 'created_by';
    }else if(key === 'idOrder'){
        return 'id_order';
    }else if(key === 'productName'){
        return 'product_name';
    }else if(key === 'paid'){
        return 'is_paid';
    }else{
        return key;
    }
}