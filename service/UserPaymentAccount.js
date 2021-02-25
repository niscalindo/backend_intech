        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const userPaymentAccount = db.user_payment_account;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.getAll = function(security,idUser, result){
    userPaymentAccount.findAll({
        attributes:{
            exclude: ['createdBy', 'dateCreated']
        },
        where: {
            status:{
                [operator.ne]: '0'
            },
            id_user:{
                [operator.eq]: idUser
            }
        },
        order: [
            ['id_account', 'asc']
        ]
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
exports.create = function(newData,security, result){
    newData['status'] = '1';  
    newData['dateCreated'] = new Date();   
    userPaymentAccount.create(newData).then(data=>{
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
//
exports.update= function(newData, result){
    userPaymentAccount.update(
        newData,
        {
            where: {id_account: parseInt(newData.id)}
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
//function columnDictionary(key){
//    if(key === 'id'){
//        return 'id_sub_category';
//    }else if(key === 'idCategory'){
//        return 'id_category';
//    }else if(key === 'subCategoryName'){
//        return 'sub_category_name';
//    }else if(key === 'subCategoryCode'){
//        return 'sub_category_code';
//    }
//}
// exports.find = function(security,field, result){
//     let op = null;
//     let conditionKey = new Object();
//     for (let [key, value] of Object.entries(field)) {
//         let condition = new Object();
//         if(key === "makeMain"){
//             op = operator.substring;
//             condition[op] = value;
//             conditionKey[columnDictionary(key)] = condition;
//         }else{
//             op = operator.eq;
//             condition[op] = value;
//             conditionKey[columnDictionary(key)] = condition;
//         }
        
//     }
//     let condition = new Object();
//     condition[operator.eq] = '1';
//     conditionKey['status'] = condition;
    
//     userPaymentAccount.findAll({
//         attributes:{
//             exclude: ['createdBy','dateCreated']
//         },
//         where: [conditionKey]
//     }).then(data=>{
//         if(data == null){
//             result("Not Found", 404, null);
//         }else{
//             security.encrypt(data)
//             .then(function(encryptedData){
//                 result("success", 200, encryptedData);
//             }).catch(function(error){
//                 result(error, 500, null);
//             });            
//         }
//     }).catch(err=>{
//        result(err.message, 500, null);
//     });
// }

exports.find = function(security,field, result){
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "makeMain"){
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
    
    userPaymentAccount.findAll({
        attributes:{
            exclude: ['createdBy','createdAt']
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

function columnDictionary(key){
    if(key === 'makeMain'){
        return 'make_main';
    }else if(key === 'idUser'){
        return 'created_by';
    }else{
     return key;
     }
 }