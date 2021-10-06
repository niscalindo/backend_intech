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
            productIncludeObject.where = conditionProduct;
        }else if((key === "idStore" || key === "isPaid") || (key === "isDelivered" || key === "isFinish")){
            op = operator.eq;
            condition[op] = value;
            conditionStore[columnDictionary(key)] = condition;
        }else if(key === "startDate"){
            op = operator.between;
            condition[op] = [Date.parse(value),Date.parse(field.endDate)];
            conditionKey['date_created'] = condition;
        }else{
            if(key != "endDate"){
                op = operator.eq;
                condition[op] = value;
                conditionKey[columnDictionary(key)] = condition;
                if(key == "status"){
                    op = operator.eq;
                    condition[op] = value;
                    conditionStore[columnDictionary(key)] = condition;
                }
            }
            
        }
    }
    if(field.status === 'undefined' || field.status === null){
        op = operator.ne;
        condition[op] = '0';
        conditionKey['status'] = condition;
        
        op = operator.ne;
        condition[op] = '0';
        conditionStore['status'] = condition;
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

exports.update= function(newData, result){
    detailOrderStore.update(
        newData,
        {
            where: {id_order_store: parseInt(newData.idOrderStore)}
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

function columnDictionary(key){
    if(key === 'createdBy'){
        return 'created_by';
    }else if(key === 'idOrder'){
        return 'id_order';
    }else if(key === 'idStore'){
        return 'id_store';
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