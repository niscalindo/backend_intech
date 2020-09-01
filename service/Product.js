        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const productModel = db.product;
const productVarianModel = db.product_varian;
const pictures = db.pictures;
const Sequelize = db.Sequelize;
const operator =  Sequelize.Op;
const sequelize = db.sequelize;

//exports.getAll = function(security,order, result){
//    categoryProduct.findAll({
//        attributes:{
//            include: [[sequelize.fn('COUNT', sequelize.col('subCategories.id_category')), 'totalChild']],
//            exclude: ['created_by', 'date_created']
//        },
//        where: {
//            status:{
//                [operator.eq]: '1'
//            }
//        },
//        include:[{
//                model: subCategoryProduct,
//                as: 'subCategories',
//                attributes:[],
//                where: {
//                    status:{
//                        [operator.eq]: '1'
//                    }
//                }
//            }
//        ],
//        group: 'tm_category_product.id_category',
//        order: [
//            ['id_category', order]
//        ]
//        
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
//

exports.countRecords = function (param, result) {
    let conditionKey = new Object();
    let conditionKeyVarian = new Object();
    if(param.countAll == 'undefined' || param.countAll == null){
        if (typeof param.name != 'undefined' && typeof param.name != null) {
            if (param.name != "") {
                conditionKey[operator.or] = [Sequelize.where(Sequelize.fn('concat', Sequelize.col('product.product_name'), ' ', Sequelize.col('varian.varian_title')), {
                        [operator.substring]: param.name
                    }), Sequelize.where(Sequelize.fn('concat', Sequelize.col('product.product_name'), ' ', Sequelize.col('varian.color')), {
                        [operator.substring]: param.name
                    })];
            }
    }
    }
    let condition2 = new Object();
    condition2[operator.ne] = '0';
    conditionKey['status'] = condition2;

//    let conditionVarian = new Object();
//    conditionVarian[operator.eq] = '1';
//    conditionKeyVarian['status'] = conditionVarian;

    productModel.count({
        where: [conditionKey],
//        include: [
//            {
//                model: productVarianModel,
//                as: 'varian',
//                attributes: [],
//                required: false,
//                where: [conditionKeyVarian]
//            }
//        ],
//        distinct: true,
//        col: 'id_product'
    }).then(data => {
        result("success", 200, data);
    }).catch(err => {
        result(err.message, 500, null);
    });
}
exports.find = function (security, order, orderBy, offset, limit, field, result) {
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
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
    
    let orderOption = Array();
    orderOption[0] = [columnDictionary(orderBy), order];
    
    productModel.findAll({
        attributes:{
            exclude: ['createdBy','idSubCategory']
        },
        order: orderOption,
        offset: parseInt(offset),
        limit: parseInt(limit), 
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
exports.getAll = function (security, order, offset, limit, id, result) {
    productModel.findAll({
        attributes: {
            exclude: ['createdBy', 'dateCreated']
        },
        where: {
            status: {
                [operator.eq]: '1'
            },
            created_by: {
                [operator.eq]: id
            }
        },
        offset: parseInt(offset),
        limit: limit,
        order: [
            ['id_product', order]
        ],
//        include: [
//            {model: supPubModel,
//                as: 'suplierPublisher',
//                attributes: {exclude: ['created_by', 'date_created', 'idDistributor']}
//            },
//            {
//                model: productVarianModel,
//                as: 'varian',
//                attributes: []
//            }
//        ]
    }).then(data => {
        security.encrypt(data)
                .then(function (encryptedData) {
                    result("success", 200, encryptedData);
                }).catch(function (error) {
            result(error, 500, null);
        });
    }).catch(err => {
        result(err.message, 500, null);
    });
}

exports.create = function (newData, security, result) {
    newData.status = '1';
    newData.dateCreated = new Date();
    let associationArray = new Array();
    let index = 0;
    if((newData.varian != "undefined" && newData.varian != null)){
        for (let i = 0; i < newData['varian'].length; i++) {
            newData['varian'][i]['status'] = '1';
            newData['varian'][i]['dateCreated'] = new Date();
            newData['varian'][i]['createdBy'] = newData['createdBy'];
        }
        let varianObject = new Object;
        varianObject.association = productModel.associations.varian;
        associationArray[index] = varianObject;
        index++;
    }
    if((newData.pictures != "undefined" && newData.pictures != null)){
        for (let i = 0; i < newData['pictures'].length; i++) {
            newData['pictures'][i]['status'] = '1';
            newData['pictures'][i]['dateCreated'] = new Date();
            newData['pictures'][i]['createdBy'] = newData['createdBy'];
        }
        let picturesObject = new Object;
        picturesObject.association = productModel.associations.pictures;
        associationArray[index] = picturesObject;
    }
    console.log("saving data product..");
    let action = null;
    if(associationArray.length > 0){
        action = productModel.create(newData, {include: associationArray});
    }else{
        action = productModel.create(newData);
    }
    action.then(data => {
        security.encrypt(data)
                .then(function (encryptedData) {
                    result("success", 201, encryptedData.dataValues.id);
                }).catch(function (error) {
            result(error, 500, null);
        });
    }).catch(err => {
        console.log(err);
        result(err.message, 500, null);
    });
}

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
        return 'id_product';
    }else if(key === 'name'){
        return 'product_name';
    }else if(key === 'idSubCategory'){
        return 'id_sub_category';
    }else{
        return key;
    }
}