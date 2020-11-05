        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const productVarianModel = db.product_varian;
const productModel = db.product;
const detailPromoModel = db.detail_promo;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.find = function(security, orderBy, order, offset, limit,field, result){
    let op = null;
    let conditionForProduct = new Object();
    op = operator.eq;
    let condition = new Object();
    condition[op] = '1';
    conditionForProduct['status'] = condition;
    let conditionForVarian = new Object();
    if(field != null){
        for (let [key, value] of Object.entries(field)) {
            let condition = new Object();

            if(key == "name"){

            }else if(key == "dateCreated"){
                if(field.dateOp != "undefined" && isValidDate(value)){
                    if(field.dateOp == "lt"){
                        op = operator.lt;                  
                    }else if(field.dateOp == "gt"){
                        op = operator.gt;                       
                    }else{
                        result("Bad Request - Unknown date operator", 400, null);
                        return; 
                    }
                    condition[op] = value;
                    conditionForProduct[columnDictionary(key)] = condition;
                }else{
                    result("Bad Request - Unknown date or operator", 400, null);
                    return;
                }
            }else if(key == "category"){

            }else if(key == "subCategory"){

            }
        }
    }
    let orderOption = Array();
    orderOption[0] = [{
        model: productModel,
        as: 'product'
    }, columnDictionary(orderBy), order];
    
    productVarianModel.findAll({
        attributes:{
            exclude: ['createdBy','id_product']
        },
        include:[
            {
                model: detailPromoModel,
                as: 'detailPromo',
                attributes:{exclude: ['createdBy', 'dateCreated']},
                required: false
            },
            {
                model: productModel,
                as: 'product',
                attributes:{exclude: ['createdBy', 'dateCreated']},
                where: conditionForProduct
            },
        ],
        offset: parseInt(offset),
        limit: limit,
        where:conditionForVarian,
//        order: orderOption
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            result(error, 500, null);
        });
    }).catch(err=>{
        console.log(err);
       result(err.message, 500, null);
    });
};

//exports.find = function(security,field, result){
//    let op = null;
//    let conditionKey = new Object();
//    for (let [key, value] of Object.entries(field)) {
//        let condition = new Object();
//        if(key === "categoryName" || key === "subCategoryName" ){
//            op = operator.substring;
//            condition[op] = value;
//            conditionKey[columnDictionary(key)] = condition;
//        }else{
//            op = operator.eq;
//            condition[op] = value;
//            conditionKey[columnDictionary(key)] = condition;
//        }
//        
//    }
//    let condition = new Object();
//    condition[operator.eq] = '1';
//    conditionKey['status'] = condition;
//    
//    subCategoryProduct.findAll({
//        attributes:{
//            include: [[sequelize.fn('COUNT', sequelize.col('furtherSubCategories.id_sub_category')), 'totalChild']],
//            exclude: ['created_by']
//        },
//        include:[{
//                model: furtherSubCategoryProduct,
//                as: 'furtherSubCategories',
//                attributes:[],
//                where: {
//                    status:{
//                        [operator.eq]: '1'
//                    }
//                },
//                required:false
//            }
//        ],
//        group: 'tm_sub_category_product.id_sub_category',
//        where: [conditionKey]
//    }).then(data=>{
//        if(data == null){
//            result("Not Found", 404, null);
//        }else{
//            security.encrypt(data)
//            .then(function(encryptedData){
//                result("success", 200, encryptedData);
//            }).catch(function(error){
//                result(error, 500, null);
//            });            
//        }
//    }).catch(err=>{
//       result(err.message, 500, null);
//    });
//}
//
//exports.create = function(newData,security, result){
//    newData['status'] = '1';  
//    newData['dateCreated'] = new Date();   
//    subCategoryProduct.create(newData).then(data=>{
//        security.encrypt(data)
//        .then(function(encryptedData){
//            let newInsertedId = encryptedData.dataValues.id;
//            let newData = new Object();
//            newData['id'] = newInsertedId;
//            result("success",201,newData);
//        }).catch(function(error){
//            result(error,500,null);
//        });        
//    }).catch(err=>{
//        result(err.message, 500, null);
//    });
//};
//
//exports.update= function(newData, result){
//    subCategoryProduct.update(
//        newData,
//        {
//            where: {id_sub_category: parseInt(newData.id)}
//        }).then(function(data){
//        if(data[0] == 1){
//            result("success", 200, data[0]);
//        }else{
//            result("no changes", 200, data[0]);
//        }
//    })
//    .catch(err=>{
//        result(err.message, 500, null);
//    });
//};
//exports.findMaxNumerator= function( result){
//    subCategoryProduct.findOne({
//        attributes:[
//            [sequelize.fn('max', sequelize.col('id_sub_category')), 'numerator']
//        ],
//        order: [
//            ['id_sub_category', 'desc']
//        ]
//    }).then(data=>{
//        result("success", 200, data);
//    }).catch(err=>{
//        result(err.message, 500, null);
//    });
//}
function columnDictionary(key){
    if(key === 'id'){
        return 'id_product_varian';
    }else if(key === 'idCategory'){
        return 'id_category';
    }else if(key === 'subCategoryName'){
        return 'sub_category_name';
    }else if(key === 'subCategoryCode'){
        return 'sub_category_code';
    }else if(key === 'dateCreated'){
        return 'date_created';
    }else{
        return key;
    }
}
function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}