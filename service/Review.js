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
const log = require('../utils/logger');

exports.countResult = function(orderBy, order,field,scope, result){
    let parent = null;
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
            op = operator.eq;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
    }
    let condition = new Object();
    op = operator.gt;
    condition[op] = 0;
    conditionKey['review_score'] = condition;
    
    if(field.status === 'undefined' || field.status === null){
        op = operator.ne;
        condition[op] = '0';
        conditionKey['status'] = condition;
    }
    let conditionObject = {
        where: [conditionKey]
    }
    let orderOption = Array();
    orderOption[0] = [columnDictionary(orderBy), order];
    if(scope!= "null" && scope == "all"){
        conditionObject.include={
            model: db.detailOrderStore,
            as: 'store',
            include:{
                model: db.order,
                as: 'order',
                include:{
                    model: db.users,
                    as: 'buyer'
                }
            }
        }
    }
    conditionObject.order = orderOption;
    detailOrderProduct.count(conditionObject).then(data=>{
        result("success", 200, data);
    }).catch(err=>{
        log.review.error(err);
        result("Internal Server Error", 500, null);
    });
}

exports.find = function(security,orderBy, order, offset, limit,field,scope, result){
    let parent = null;
    let op = null;
    let conditionKey = new Object();
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
            op = operator.eq;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
    }
    let condition = new Object();
    op = operator.gt;
    condition[op] = 0;
    conditionKey['review_score'] = condition;
    
    if(field.status === 'undefined' || field.status === null){
        op = operator.ne;
        condition[op] = '0';
        conditionKey['status'] = condition;
    }
    let conditionObject = {
        where: [conditionKey]
    }
    let orderOption = Array();
    orderOption[0] = [columnDictionary(orderBy), order];
    if(scope!= "null" && scope == "all"){
        conditionObject.include={
            model: db.detailOrderStore,
            as: 'store',
            include:{
                model: db.order,
                as: 'order',
                include:{
                    model: db.users,
                    as: 'buyer'
                }
            }
        }
    }
    conditionObject.offset = parseInt(offset);
    conditionObject.limit = limit;
    conditionObject.order = orderOption;
    if(typeof field.idStore == 'undefined' || typeof field.idStore == null){
        detailOrderProduct.findAll(conditionObject).then(data=>{
            if(data == null){
                result("Not Found", 404, null);
            }else{
                security.encrypt(data)
                .then(function(encryptedData){
                    result("success", 200, encryptedData);
                }).catch(function(error){
                    log.review.error(error);
                    result("Encryption Failed", 1000, null);
                });            
            }
        }).catch(err=>{
            log.review.error(err);
            result("Internal Server Error", 500, null);
        });
    }else{
        db.product_varian.findAll({
        attributes:['id_product_varian'],
            where:[
                {
                    created_by:{
                        [operator.eq]: field.idStore
                    }
                }
            ]
        }).then(data=>{
            if(data == null){
                result("Not Found", 404, null);
            }else{
                let idObject = JSON.parse(JSON.stringify(data));
                let idArray = new Array();
                for(let i = 0; i<idObject.length; i++){
                    idArray[i] = idObject[i].id_product_varian;
                }
                let orderProductAttributes = new Object();
                let conditionKey = new Object();
                let conditionProductKey = new Object();
                let condition = new Object();

                op = operator.in;
                condition[op] = idArray;
                conditionProductKey['id_product_varian'] = condition;

                condition = new Object();
                op = operator.not;
                condition[op] = null;
                conditionProductKey['review_score'] = condition;

                condition = new Object();
                op = operator.gt;
                condition[op] = 0;
                conditionProductKey['review_score'] = condition;

                condition = new Object();
                op = operator.eq;
                condition[op] = "1";
                conditionKey['status'] = condition;

                condition = new Object();
                op = operator.eq;
                condition[op] = "1";
                conditionKey['is_finish'] = condition;

                orderProductAttributes.where = [conditionProductKey];
                orderProductAttributes.attributes={exclude:['idOrderStore','id_order_store','idProductVarian','discountAmount','priceAfterDiscount','packetWeight','packetUnit','sku']};
                orderProductAttributes.include={
                    model: db.detailOrderStore,
                    as: 'store',
                    attributes: [['id_store','idStore']],
                    where: [conditionKey],
                    include:{
                        model: db.order,
                        as: 'order',
                        attributes: [['id_order','idOrder'],'invoice'],
                        include: {
                            model: db.users,
                            attributes: [['full_name','fullName'],['photo_account','photoAccount']],
                            as: 'buyer'
                        }
                    }
                };
                db.detailOrderProduct.findAll(orderProductAttributes).then(dataCurrent=>{
                    if(dataCurrent == null){
                        log.review.info("Data not found");
                        result("Not Found", 404, null);
                    }else{
                        security.encrypt(dataCurrent)
                        .then(function(encryptedData){
                            result("success", 200, encryptedData);
                        }).catch(function(error){
                            log.review.error(error);
                            result("Encryption Failed", 1000, null);
                        }); 
                    }
                    
                }).catch(err=>{
                    log.review.error(err);
                    result("Internal Server Error", 500, null);
                });
            }

        }).catch(err=>{
            log.review.error(err);
            result("Internal Server Error", 500, null);
        });
    }
}

exports.create = function(newData, result){
     detailOrderProduct.update(
        newData,
        {
            where: {id_order_product: parseInt(newData.id)}
        }).then(function(data){
        if(data[0] == 1){
            result("success", 200, data[0]);
        }else{
            result("no changes", 1001, data[0]);
        }
    })
    .catch(err=>{
        log.review.error(err);
        result("Internal Server Error", 500, null);
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
    }else if(key === 'idProductVarian'){
        return 'id_product_varian';
    }else if(key === 'star'){
        return 'review_score';
    }else{
        return key;
    }
}