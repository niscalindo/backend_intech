        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const productVarianModel = db.product_varian;
const productModel = db.product;
const subCategoryProduct = db.sub_category_product;
const pictureModel = db.pictures;
const userModel = db.users;
const trAddress = db.tr_address;
const detailPromoModel = db.detail_promo;
const promoModel = db.promo;
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
};
exports.countResult = function(orderBy, order,field, result){
    let op = null;
    let conditionForProduct = new Object();
    let conditionForCategory = new Object();
    let conditionForVarian = new Object();
    let conditionCategory = new Object();
    op = operator.eq;
    let condition = new Object();
    condition[op] = '1';
    conditionForProduct['status'] = condition;
    let productObject = new Object();
    productObject['model']= productModel;
    productObject['as']='product';
    productObject['attributes']={exclude: ['dateCreated']};
    if(field != null){
        for (let [key, value] of Object.entries(field)) {
            let condition = new Object();
            if(key == "name"){
                let condition = new Object();
                let populateCondition = new Array();
                let splittedKey = decodeURI(value).split(" ");
                for(let i = 0; i<splittedKey.length; i++){
                    let findInName = new Object();
                    findInName[operator.substring] = splittedKey[i];
                    let conditionName = new Object();
                    conditionName['product_name'] = findInName;
                    populateCondition[i] = conditionName;
                }
                condition[operator.or] = populateCondition;
                conditionForProduct= condition;
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
                conditionCategory[op] = value;
                conditionForCategory['id_category'] = conditionCategory;
                let categoryModel = { 
                    model: subCategoryProduct,
                    as: 'subCategory',
                    exclude: ['createdBy','dateCreated','status'],
                    where:conditionForCategory
                }
                productObject['include']=categoryModel;
            }else if(key == "subCategory"){
                conditionCategory[op] = value;
                conditionForProduct['id_sub_category'] = conditionCategory;
            }else if(key == "minPrice"){
                op = operator.gte;
                condition[op] = value;
                conditionForVarian['price'] = condition;
            }else if(key == "maxPrice"){
                op = operator.lte;
                condition[op] = value;
                conditionForVarian['price'] = condition;
            }
        }
    }
    productObject['where']=conditionForProduct;
    let orderOption = Array();
    orderOption[0] = [{
        model: productModel,
        as: 'product'
    }, columnDictionary(orderBy), order];
    try{
        let currentDate = new Date();
        productVarianModel.count({
            attributes:{
                exclude: ['createdBy','id_product']
            },
            include:[
                {
                    model: detailPromoModel,
                    as: 'detailPromo',
                    attributes:{exclude: ['createdBy', 'dateCreated']},
                    required: false,
                    include:[
                        {
                            model: promoModel,
                            as: 'promo',
                            attributes:{exclude: ['createdBy', 'dateCreated']},
                            required: false,
                            where:[
                                    {
                                        date_started:{
                                            [operator.lte]:Date.parse(currentDate.datetime().toString())
                                        }
                                    },
                                    {
                                        date_ended:{
                                            [operator.gte]:Date.parse(currentDate.datetime().toString())
                                        }
                                    }
                            ]
                        }
                     ]
                },
                productObject
            ],
            distinct: true,
            col: 'id_product_varian',
            where:conditionForVarian,
    //        order: orderOption
        }).then(data=>{
            result("success", 200, data);
        }).catch(err=>{
           console.log(err);
           result(err.message, 500, null);
        });
    }catch(error){
        console.log(error);
        result(error.message, 500, null);
    }
}
exports.find = function(security, orderBy, order, offset, limit,field, result){
    let op = null;
    let conditionForProduct = new Object();
    let conditionForCategory = new Object();
    let conditionForVarian = new Object();
    let conditionCategory = new Object();
    let categoryIncludeArray = new Array();
    let indexCategoryArray = 0;
    op = operator.eq;
    let condition = new Object();
    condition[op] = '1';
    conditionForProduct['status'] = condition;
    let productOwnerObject = new Object();
    productOwnerObject['model']= userModel;
    productOwnerObject['as']='owner';
    productOwnerObject['attributes']={exclude: ['password','username','code','email','idCitizen','photoIdCitizen','photoId','serialNumber','dob','fullName','phoneNumber','dateCreated']};
    let productObject = new Object();
    productObject['model']= productModel;
    productObject['as']='product';
    productObject['attributes']={exclude: ['dateCreated']};
    if(orderBy == "productName"){
        productObject['order']=[[[columnDictionary(orderBy), order]]];
    }
    let orderOption = Array();
    if(orderBy == "productName"){
        orderOption[0]=[sequelize.literal('`product.name`'),order]
    }else{
        orderOption[0] = [columnDictionary(orderBy), order];
    }       
    if(field != null){
        for (let [key, value] of Object.entries(field)) {
            let condition = new Object();
            if(key == "name"){
                let populateCondition = new Array();
                let splittedKey = decodeURI(value).split(" ");
                for(let i = 0; i<splittedKey.length; i++){
                    let findInName = new Object();
                    findInName[operator.substring] = splittedKey[i];
                    let conditionName = new Object();
                    conditionName['product_name'] = findInName;
                    populateCondition[i] = conditionName;
                }
                condition[operator.or] = populateCondition;
                conditionForProduct= condition;
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
//                console.log("here : "+value);
                conditionCategory[op] = value;
                conditionForCategory['id_category'] = conditionCategory;
                let categoryModel = { 
                    model: subCategoryProduct,
                    as: 'subCategory',
                    exclude: ['createdBy','dateCreated','status'],
                    where:conditionForCategory
                }
                
                categoryIncludeArray[indexCategoryArray] = categoryModel;
                indexCategoryArray++;
//                productObject['include']=categoryModel;
            }else if(key == "subCategory"){
                conditionCategory[op] = value;
                conditionForProduct['id_sub_category'] = conditionCategory;
            }else if(key == "minPrice"){
                op = operator.gte;
                condition[op] = value;
                conditionForVarian['price'] = condition;
            }else if(key == "maxPrice"){
                op = operator.lte;
                condition[op] = value;
                conditionForVarian['price'] = condition;
            }else if(key == "idStore"){
                op = operator.eq;
                let conditionForOwner= new Object();
                condition[op] = value;
                conditionForOwner['id'] = condition;
                productOwnerObject['where']=conditionForOwner;
            }
        }
    }
    productOwnerObject['include']=[{
            model:db.tr_address,
            as:'addresses',
            where:[{
                status:'1'
            },
            {
                store_address:'1'
            }],
            include:[
                {
                    model:db.province,
                    as: 'province'
                },
                {
                    model:db.regency,
                    as: 'city'
                },
                {
                    model:db.district,
                    as:'district'
                }
            ],
            required: true
    }];
    categoryIncludeArray[indexCategoryArray] = productOwnerObject;
    productObject['include'] = categoryIncludeArray;
//    productObject['include']=productOwnerObject
    productObject['where']=conditionForProduct;
    
    try{
        let currentDate = new Date();
        productVarianModel.findAll({
            attributes:{
                exclude: ['createdBy','id_product']
            },
            include:[
                {
                    model: detailPromoModel,
                    as: 'detailPromo',
                    attributes:{exclude: ['createdBy', 'dateCreated']},
                    required: false,
                    include:[
                        {
                            model: promoModel,
                            as: 'promo',
                            attributes:{exclude: ['createdBy', 'dateCreated']},
                            required: false,
                            where:[
                                    {
                                        date_started:{
                                            [operator.lte]:Date.parse(currentDate.datetime().toString())
                                        }
                                    },
                                    {
                                        date_ended:{
                                            [operator.gte]:Date.parse(currentDate.datetime().toString())
                                        }
                                    }
                            ]
                        }
                     ]
                },
                productObject,
                {
                    model: db.product_like,
                    as: 'likes',
                    attributes:{exclude: ['dateCreated']},
                    required: false
                }
            ],
            offset: parseInt(offset),
            limit: limit,
            where:conditionForVarian,
            order: orderOption
        }).then(data=>{
            security.encrypt(data)
            .then(function(encryptedData){
                result("success", 200, encryptedData);
            }).catch(function(error){
                console.log(error);
                result(error, 500, null);
            });
        }).catch(err=>{
           console.log(err);
           result(err.message, 500, null);
        });
    }catch(error){
        console.log(error);
        result(error.message, 500, null);
    }
}
exports.findOne = function(security, field, result){
    let op = null;
    let conditionForProduct = new Object();
    op = operator.eq;
    let condition = new Object();
    condition[op] = '1';
    conditionForProduct['status'] = condition;
    let conditionForVarian = new Object();
    if(field.id!= "undefined" && field.id != null){
        let conditionVarian = new Object();
        conditionVarian[op] = field.id;
        conditionForVarian['id_product_varian'] = conditionVarian;
        try{
            let currentDate = new Date();
            productVarianModel.findAll({
                attributes:{
                    exclude: ['createdBy','id_product']
                },
                include:[
                    {
                        model: detailPromoModel,
                        as: 'detailPromo',
                        attributes:{exclude: ['createdBy', 'dateCreated']},
                        required: false,
                        include:[
                            {
                                model: promoModel,
                                as: 'promo',
                                attributes:{exclude: ['createdBy', 'dateCreated']},
                                required: false,
                                where:[
                                        {
                                            date_started:{
                                                [operator.lte]:Date.parse(currentDate.datetime().toString())
                                            }
                                        },
                                        {
                                            date_ended:{
                                                [operator.gte]:Date.parse(currentDate.datetime().toString())
                                            }
                                        }
                                ]
                            }
                         ]
                    },
                    {
                        model: productModel,
                        as: 'product',
                        attributes:{exclude: [ 'dateCreated']},
                        where: conditionForProduct,
                        include:[
                            {
                                model: userModel,
                                as: 'owner',
                                include:[{
                                    model:db.tr_address,
                                    as:'addresses',
                                    where:[{
                                        status:'1'
                                    },
                                    {
                                        store_address:'1'
                                    }],
                                    include:[
                                        {
                                            model:db.province,
                                            as: 'province'
                                        },
                                        {
                                            model:db.regency,
                                            as: 'city'
                                        },
                                        {
                                            model:db.district,
                                            as:'district'
                                        }
                                    ],
                                    required: true
                            }],
                                attributes:{exclude: ['password','username','code','email','idCitizen','photoIdCitizen','photoId','serialNumber','dob','fullName','phoneNumber','dateCreated']}
                            },
                            {
                                model: pictureModel,
                                as: 'pictures',
                                attributes:{exclude: ['createdBy', 'dateCreated']}
                            }
                        ]
                    },
                ],
                where:conditionForVarian,
            }).then(data=>{
                security.encrypt(data)
                .then(function(encryptedData){
                    result("success", 200, encryptedData);
                }).catch(function(error){
                    console.log(error);
                    result(error, 500, null);
                });
            }).catch(err=>{
               console.log(err);
               result(err.message, 500, null);
            });
        }catch(error){
            console.log(error);
            result(error.message, 500, null);
        }
    }else{
        result("Bad Request", 400, null);  
    }
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
    }else if(key === 'idProductVarian'){
        return 'id_product_varian';
    }else if(key === 'idCategory'){
        return 'id_category';
    }else if(key === 'subCategoryName'){
        return 'sub_category_name';
    }else if(key === 'subCategoryCode'){
        return 'sub_category_code';
    }else if(key === 'dateCreated'){
        return 'date_created';
    }else if(key === 'createdBy'){
        return 'created_by';
    }else if(key === 'productName'){
        return 'name';
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