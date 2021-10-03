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

Date.prototype.datetime = function() {
    var datetime = this.getFullYear() + "-"
                + (this.getMonth()+1)  + "-" 
                + this.getDate() + " "  
                + this.getHours() + ":"  
                + this.getMinutes() + ":" 
                + this.getSeconds();
        return datetime;
};

exports.find = function(security,field,sort, orderBy, scope, result){
    let orderOption = Array();
    orderOption[0] = [columnDictionary(orderBy), sort];
    let parent = null;
    let op = null;
    let conditionKey = new Object();
    let conditionStore = new Object();
    let conditionProduct = new Object();
    let productIncludeObject = {
            model: db.detailOrderProduct,
            as: 'products'
        }
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "productName"){
            op = operator.substring;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }else if(key === "keyword"){
            op = operator.like;
            condition[op] = '%'+value+'%';
            conditionProduct['product_name'] = condition;
            productIncludeObject.where = conditionForProduct;
        }else if(key === "idStore"){
            op = operator.eq;
            condition[op] = value;
            conditionStore['id_store'] = condition;
        }else if(key === "startDate"){
            op = operator.between;
            condition[op] = [Date.parse(value),Date.parse(field.endDate)];
            conditionKey['date_created'] = condition;
        }else{
            if(key != "endDate"){
                op = operator.eq;
                condition[op] = value;
                conditionKey[columnDictionary(key)] = condition;
            }
        }
    }
    if(field.status === 'undefined' || field.status === null){
        op = operator.ne;
        condition[op] = '0';
        conditionKey['status'] = condition;
    }
    let conditionObject = {
        where: [conditionKey],
        order: orderOption
    }
    conditionObject.include=[
        {
            model: db.detailOrderStore,
            as: 'stores',
            where: [conditionStore],
            include:productIncludeObject
        },
        {
            model: db.users,
            as: 'buyer',
            attributes:['fullName','photoAccount']
        }
    ]
    order.findAll(conditionObject).then(data=>{
        if(data == null){
            result("Not Found", 404, null);
        }else{
            security.encrypt(data)
            .then(function(encryptedData){
                result("success", 200, encryptedData);
            }).catch(function(error){
                log.order.error(error);
                result("Encryption Failed", 1000, null);
            });            
        }
    }).catch(err=>{
        log.order.error(err);
        result("Internal Server Error", 500, null);
    });
}
exports.countSelling = function(field,scope, result){
    let parent = null;
    let op = null;
    let conditionKey = new Object();
    let orderCondition = new Object();
    let searchInOrder = false;
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "productName"){
            op = operator.substring;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }else if(key === "transaction"){
            if(value === "finish"){
                op = operator.eq;
                condition[op] = "1";
                orderCondition['is_finish'] = condition;                
            }else if(value === "paid"){
                op = operator.eq;
                condition[op] = "1";
                orderConditionKey['is_paid'] = condition;
            }
        }else{
            if(key!="createdBy"){
                op = operator.eq;
                condition[op] = value;
                conditionKey[columnDictionary(key)] = condition;                
            }
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
    let includeOrderObject = {
        model: db.order,
        as: 'order'
    }
    if(searchInOrder){
       let conditionOrder = {
           where: [orderCondition]
       } 
       includeOrderObject['include']=conditionOrder;
    }
    if(scope!= "null" && scope == "all"){
        conditionObject.include={
            model: db.detailOrderStore,
            as: 'store',
            include:includeOrderObject
        }
    }
    detailOrderProduct.count(conditionObject).then(data=>{
        result("success", 200, data);
    }).catch(err=>{
        log.order.error(err);
        result("Internal Server Error", 500, null);
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
            log.order.error(error);
            result("Encryption Failed", 1000, null);
        });        
    }).catch(err=>{
        log.order.error(err);
        result("Internal Server Error", 500, null);
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
            result("no changes", 1001, data[0]);
        }
    })
    .catch(err=>{
        log.order.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.checkExpiredOrder= function(){
    log.order.info("checking expired order..")
    let currentDate = new Date();
    order.findAll({
        attributes:{
            include: ['id', 'paymentTimeLimit']
        },
        where: [{
                payment_time_limit:{
                    [operator.lte]:Date.parse(currentDate.datetime().toString())
                }
            },
            {
                is_paid:{
                    [operator.eq]:'0'
                }
            },
            {
                status:{
                    [operator.eq]:'1'
                }
            }
        ],
        order: [
            ['id_order', 'asc']
        ],
    }).then(data=>{
        let updatedOrder;
        log.order.info("Expired Order "+data.length);
        for(let i=0; i<data.length; i++){
            updatedOrder = new Object();
            updatedOrder.id = data[i].dataValues.id;
            updatedOrder.status = '2';
            updatedOrder.cancelReason = 'Batal Otomatis';
            updatedOrder.canceledDate = new Date();
            order.update(
                updatedOrder,
                {
                    where: {id_order: parseInt(updatedOrder.id)}
                }).then(function(data){
                if(data[0] == 0){
                    log.info("No changes");
                }
            })
            .catch(err=>{
                log.order.error(err);
            });
        }
//        console.log(data[0].dataValues);
    }).catch(err=>{
        log.order.error(err);
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
    }else if(key === 'idProductVarian'){
        return 'id_product_varian';
    }else if(key === 'productName'){
        return 'product_name';
    }else if(key === 'isPaid'){
        return 'is_paid';
    }else if(key === 'isFinish'){
        return 'is_finish';
    }else if(key === 'isDelivered'){
        return 'is_delivered';
    }else{
        return key;
    }
}