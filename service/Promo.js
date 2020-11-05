        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const promoModel = db.promo;
const detailPromoModel = db.detail_promo;
const productModel = db.product;
const productVarianModel = db.product_varian;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

Date.prototype.datetime = function() {
    var datetime = this.getFullYear() + "-"
                + (this.getMonth()+1)  + "-" 
                + this.getDate() + " "  
                + this.getHours() + ":"  
                + this.getMinutes() + ":" 
                + this.getSeconds();
        return datetime;
//    return [this.getFullYear(),
//          (mm>9 ? '' : '0') + mm,
//          (dd>9 ? '' : '0') + dd
//         ].join('');
};

exports.find = function(security,order,source,id,field, result){
    
    let conditionDetails = new Object();
    let conditionFirst = new Object
    if(source == "user"){
        conditionDetails = 
            {
                id_participant:{
                    [operator.eq]:id
                }
            }
        conditionFirst = 
            {
                [operator.or]:[
                    {
                        created_by:{
                            [operator.eq]:id
                        }
                    },
                    {
                        source:{
                            [operator.eq]:'admin'
                        }
                    },
                ]
            }
    }else{
       conditionFirst =  {
                created_by:{
                    [operator.eq]:id
                },
                source:{
                    [operator.eq]:source
                }
                
        }
    }
    if(field.status != "undefined" && field.status != null){
        let conditionDate;
        let currentDate = new Date();
        if(field.status == "ongoing"){
            conditionDate = new Array();
            conditionDate =    
            [
                {
                    date_started:{
                        [operator.lte]:Date.parse(currentDate.datetime().toString())
                    }
                },
                {
                    date_ended:{
                        [operator.gte]:Date.parse(currentDate.datetime().toString())
                    }
                },
            ];
            conditionFirst[operator.and] = conditionDate;
        }else if(field.status == "incoming"){
            conditionDate = new Object;
            conditionDate[operator.gt] = Date.parse(currentDate.datetime().toString());
            conditionFirst['date_started'] = conditionDate;
        }else if(field.status == "expired"){
            conditionDate = new Object;
            conditionDate[operator.lt] = Date.parse(currentDate.datetime().toString());
            conditionFirst['date_ended'] = conditionDate;
        }else if(field.status == "inon"){
            conditionDate = new Object;
            conditionDate[operator.gte] = Date.parse(currentDate.datetime().toString());
            conditionFirst['date_started'] = conditionDate;
        }
    }
    promoModel.findAll({
//        attributes:{
//            exclude: ['createdBy', 'dateCreated']
//        },
        include:[
            {
            model: detailPromoModel,
            required: false,
            as: 'details',
            attributes: {exclude:['createdBy', 'dateCreated']},
            where:conditionDetails,
            include:[
                    {
                        model: productVarianModel,
                        as: 'varian',
                        attributes: {exclude:['createdBy', 'dateCreated', 'idProduct']},
                        include:[
                            {
                                model: productModel,
                                as: 'product',
                                attributes: {exclude:['createdBy', 'dateCreated', 'idProduct']}
                            }
                        ]
                    }
                ]
            }
        ],
        where: conditionFirst,
        order: [
            ['id_promo', order]
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
//exports.find = function(security,field, result){
//    let parent = null;
//    let op = null;
//    let conditionKey = new Object();
//    for (let [key, value] of Object.entries(field)) {
//        let condition = new Object();
//        if(key === "parent"){
//            parent = value;
//        }
//        if(key === "name"){
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
//    let includeParent = new Object();
//    if(parent === "subCategory"){
//        includeParent = 
//            {
//                model: subCategoryProduct,
//                as: 'subCategory',
//                exclude: ['createdBy','dateCreated','status']
//            }
//    }else if(parent === "furtherSubCategory"){
//        includeParent = 
//            {
//                model: furtherSubCategoryProduct,
//                as: 'furtherSubCategory',
//                exclude: ['createdBy','dateCreated','status','idSubCategory','subCategoryName','categoryName'],
//                include:[
//                   {
//                        model: subCategoryProduct,
//                        as: 'subCategory',
//                        exclude: ['createdBy','dateCreated','status']
//                    } 
//                ]
//            }
//    }
//    brand.findAll({
//        attributes:{
//            exclude: ['createdBy','dateCreated']
//        },
//        include:[includeParent],
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

exports.create = function (newData, security, result) {
//    newData.status = '1';
    newData.dateCreated = new Date();
    let associationArray = new Array();
    if((newData.details != "undefined" && newData.details != null)){
        for (let i = 0; i < newData['details'].length; i++) {
            newData['details'][i]['status'] = '1';
            newData['details'][i]['dateCreated'] = new Date();
            newData['details'][i]['createdBy'] = newData['createdBy'];
        }
        let detailsObject = new Object;
        detailsObject.association = promoModel.associations.details;
        associationArray[0] = detailsObject;
    }
    let action = null;
    if(associationArray.length > 0){
        action = promoModel.create(newData, {include: associationArray});
    }else{
        action = promoModel.create(newData);
    }
    action.then(data => {
        security.encrypt(data)
                .then(function (encryptedData) {
                    result("success", 201, encryptedData.dataValues.id);
                }).catch(function (error) {
            result(error, 500, null);
        });
    }).catch(err => {
        result(err.message, 500, null);
    });
};

//exports.update= function(newData, result){
//    brand.update(
//        newData,
//        {
//            where: {id_brand: parseInt(newData.id)}
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
exports.findMaxNumerator= function( result){
    promoModel.findOne({
        attributes:[
            [sequelize.fn('max', sequelize.col('id_promo')), 'numerator']
        ],
        order: [
            ['id_promo', 'desc']
        ]
    }).then(data=>{
        result("success", 200, data);
    }).catch(err=>{
        result(err.message, 500, null);
    });
};
function columnDictionary(key){
    if(key === 'id'){
        return 'id_promo';
    }else if(key === 'idParticipant'){
        return 'id_participant';
    }else if(key === 'idProductVarian'){
        return 'id_product_varian';
    }else if(key === 'name'){
        return 'promo_name';
    }else{
        return key;
    }
}