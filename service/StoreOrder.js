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
        }else if(key == "status"){
            op = operator.eq;
            condition[op] = value;
            conditionStore['status'] = condition;
        }else{
            if(key != "endDate"){
//                if(key == "status"){
//                    op = operator.or;
//                    conditionKey[op] = {
//                        status: {
//                            [operator.eq]: value
//                        },
//                        '$stores.status$': {
//                            [operator.eq]: value
//                        }
//                    };
//                }else{
                    op = operator.eq;
                    condition[op] = value;
                    conditionKey[columnDictionary(key)] = condition;                    
//                }
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

exports.countSelling = function(field,scope, result){
    let parent = null;
    let op = null;
    let conditionKey = new Object();
    let storeOrderCondition = new Object();
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
                storeOrderCondition['is_finish'] = condition;                
            }else if(value === "paid"){
                op = operator.eq;
                condition[op] = "1";
                storeOrderCondition['is_paid'] = condition;
            }else if(value === "delivered"){
                op = operator.eq;
                condition[op] = "1";
                storeOrderCondition['is_delivered'] = condition;
            }else if(value === "new"){
                op = operator.eq;
                condition[op] = "0";
                storeOrderCondition['is_paid'] = condition;
            }
        }else if(key === "isDelivered"){
            op = operator.eq;
            condition[op] = value;
            storeOrderCondition[columnDictionary(key)] = condition;
        }else if(key == "idStore"){
            op = operator.eq;
            condition[op] = value;
            storeOrderCondition[columnDictionary(key)] = condition;
        }else if(key == 'status'){
            op = operator.eq;
            condition[op] = value;
            storeOrderCondition['status'] = condition;
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
        condition[op] = "0";
        storeOrderCondition['status'] = condition;  
    }
    
    let conditionObject = {
        where: [conditionKey]
    }
    if(scope!= "null" && scope == "all"){
        conditionObject.include={
            model: db.detailOrderStore,
            as: 'store',
            where: [storeOrderCondition]
        }
    }
    detailOrderProduct.count(conditionObject).then(data=>{
        result("success", 200, data);
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

exports.countOrderInStore= function(security,field,result){
    
    let detailOrderStoreAttributes = new Object();
    let conditionKey = new Object();
    let condition = new Object();
    op = operator.eq;
    condition[op] = field.idStore;
    conditionKey['id_store'] = condition;
    
    condition = new Object();
    op = operator.eq;
    condition[op] = '1';
    conditionKey['status'] = condition;
    
    condition = new Object();
    op = operator.eq;
    condition[op] = '1';
    conditionKey['is_paid'] = condition;
    
    condition = new Object();
    op = operator.eq;
    condition[op] = field.finish;
    conditionKey['is_finish'] = condition;

    let currentDate = new Date();
    let last = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
    let currentDateMonthAgo = new Date();
    let m = currentDateMonthAgo.getMonth();
    currentDateMonthAgo.setMonth(currentDateMonthAgo.getMonth() - 1);
    let lastMonthAgo = new Date(currentDateMonthAgo.getTime() - (7 * 24 * 60 * 60 * 1000));
    if(field.range == 'week'){
        condition = new Object();
        op = operator.between;
        condition[op] = [Date.parse(last.datetime().toString()), Date.parse(currentDate.datetime().toString())];
    
        if(field.finish == '1'){
            conditionKey['finish_date'] = condition;
        }else{
            conditionKey['paid_date'] = condition;
        }
    }else{
        condition = new Object();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        currentMonth = currentMonth+1;
        op = operator.and;
        if(field.finish == '1'){
            condition[op] = [sequelize.where(sequelize.fn("month", sequelize.col("finish_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("finish_date")), currentYear)]
        }else{
            condition[op] = [sequelize.where(sequelize.fn("month", sequelize.col("paid_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("paid_date")), currentYear)]
        }
        conditionKey[''] = condition;
    }

    detailOrderStoreAttributes.where = [conditionKey];
    detailOrderStore.count(detailOrderStoreAttributes).then(dataCurrent=>{
        if(dataCurrent == null){
            result("Not Found", 404, null);
        }else{
            if(field.range == 'week'){
                condition = new Object();
                op = operator.between;
                condition[op] = [Date.parse(lastMonthAgo.datetime().toString()), Date.parse(currentDateMonthAgo.datetime().toString())];
                if(field.finish == '1'){
                    conditionKey['finish_date'] = condition;
                }else{
                    conditionKey['paid_date'] = condition;
                }
                detailOrderStoreAttributes.where = [conditionKey];                
            }else{
                condition = new Object();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();
                if(currentMonth == 0){
                    currentMonth = 12;
                    currentYear = currentYear-1;
                }
                op = operator.and;
                if(field.finish == '1'){
                    condition[op] = [sequelize.where(sequelize.fn("month", sequelize.col("finish_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("finish_date")), currentYear)]
                }else{
                    condition[op] = [sequelize.where(sequelize.fn("month", sequelize.col("paid_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("paid_date")), currentYear)]
                }
                conditionKey[''] = condition;
            }
            detailOrderStore.count(detailOrderStoreAttributes).then(dataOld=>{
                if(dataOld == null){
                    result("Not Found", 404, null);
                }else{
                        result("success", 200, {currentOrder: dataCurrent, lastMonthOrder: dataOld});
                }
            }).catch(err=>{
                log.order.error(err);
                result("Internal Server Error", 500, null);
            });
        }
    }).catch(err=>{
        log.order.error(err);
        result("Internal Server Error", 500, null);
    });
}

exports.countOmzet = function(security,field,result){
    
    let detailOrderStoreAttributes = new Object();
    let conditionKey = new Object();
    let condition = new Object();
    op = operator.eq;
    condition[op] = field.idStore;
    conditionKey['id_store'] = condition;
    
    condition = new Object();
    op = operator.eq;
    condition[op] = '1';
    conditionKey['status'] = condition;
    
    condition = new Object();
    op = operator.eq;
    condition[op] = '1';
    conditionKey['is_paid'] = condition;
    
    condition = new Object();
    op = operator.eq;
    condition[op] = "1";
    conditionKey['is_finish'] = condition;

    let currentDate = new Date();
    let last = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
    let currentDateMonthAgo = new Date();
    let m = currentDateMonthAgo.getMonth();
    currentDateMonthAgo.setMonth(currentDateMonthAgo.getMonth() - 1);
    let lastMonthAgo = new Date(currentDateMonthAgo.getTime() - (7 * 24 * 60 * 60 * 1000));
    if(field.range == 'week'){
        condition = new Object();
        op = operator.between;
        condition[op] = [Date.parse(last.datetime().toString()), Date.parse(currentDate.datetime().toString())];
        conditionKey['finish_date'] = condition;
    }else{
        condition = new Object();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        currentMonth = currentMonth+1;
        op = operator.and;
        condition[op] = [sequelize.where(sequelize.fn("month", sequelize.col("finish_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("finish_date")), currentYear)]
        conditionKey[''] = condition;
    }

    detailOrderStoreAttributes.where = [conditionKey];
    detailOrderStoreAttributes.include={
        model: detailOrderProduct,
        as : 'products',
        attributes: ['product_price','discount_amount', 'price_after_discount','quantity']
    }
    detailOrderStore.findAll(detailOrderStoreAttributes).then(dataCurrent=>{
        if(dataCurrent == null){
            result("Not Found", 404, null);
        }else{
            let objectResponse = new Object();
            let dataLast7Days = JSON.parse(JSON.stringify(dataCurrent));
//            console.log("Data : "+dataLast7Days);
            if(dataLast7Days.length > 0){
                let sumPrice = 0;
                for(let i=0; i<dataLast7Days.length;i++){
                    for(let j=0; j<dataLast7Days.length;j++){
                        if(dataLast7Days[i].products[j].discount_amount != null && dataLast7Days[i].products[j].discount_amount > 0){
                            sumPrice = sumPrice + (dataLast7Days[i].products[j].price_after_discount * dataLast7Days[i].products[j].quantity);
                        }else{
                            sumPrice = sumPrice + (dataLast7Days[i].products[j].product_price * dataLast7Days[i].products[j].quantity);
                        }
                    }
                }
                objectResponse.currentOmzet = sumPrice;
            }else{
                objectResponse.currentOmzet = 0;
            }
            if(field.range == 'week'){
                condition = new Object();
                op = operator.between;
                condition[op] = [Date.parse(lastMonthAgo.datetime().toString()), Date.parse(currentDateMonthAgo.datetime().toString())];
                conditionKey['finish_date'] = condition;
            }else{
                condition = new Object();
                let currentMonth = currentDate.getMonth();
                let currentYear = currentDate.getFullYear();
                if(currentMonth == 0){
                    currentMonth = 12;
                    currentYear = currentYear-1;
                }
                op = operator.and;
                condition[op] = [sequelize.where(sequelize.fn("month", sequelize.col("finish_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("finish_date")), currentYear)]
                conditionKey[''] = condition;
            }
            detailOrderStoreAttributes.where = [conditionKey];
            detailOrderStoreAttributes.include={
                model: detailOrderProduct,
                as : 'products',
                attributes: ['product_price','discount_amount', 'price_after_discount','quantity']
            }
            detailOrderStore.findAll(detailOrderStoreAttributes).then(dataOld=>{
                if(dataOld == null){
                    result("Not Found", 404, null);
                }else{
                    let dataLastMonth = JSON.parse(JSON.stringify(dataOld));
                    if(dataLastMonth.length > 0){
                        sumPrice = 0;
                        for(let i=0; i<dataLastMonth.length;i++){
                            for(let j=0; j<dataLastMonth.length;j++){
                                if(dataLastMonth[i].products[j].discount_amount != null && dataLastMonth[i].products[j].discount_amount > 0){
                                    sumPrice = sumPrice + (dataLastMonth[i].products[j].price_after_discount * dataLastMonth[i].products[j].quantity);
                                }else{
                                    sumPrice = sumPrice + (dataLastMonth[i].products[j].product_price * dataLastMonth[i].products[j].quantity);
                                }
                            }
                        }
                        objectResponse.lastOmzet = sumPrice;
                    }else{
                        objectResponse.lastOmzet = 0;
                    }
                    result("success", 200, objectResponse);
                }
            }).catch(err=>{
                log.order.error(err);
                result("Internal Server Error", 500, null);
            });
        }
    }).catch(err=>{
        log.order.error(err);
        result("Internal Server Error", 500, null);
    });
}
exports.countStoreScore = function(security,field,result){
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
            
            
            let currentDate = new Date();
            let last = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
            let currentDateMonthAgo = new Date();
            let m = currentDateMonthAgo.getMonth();
            currentDateMonthAgo.setMonth(currentDateMonthAgo.getMonth() - 1);
            let lastMonthAgo = new Date(currentDateMonthAgo.getTime() - (7 * 24 * 60 * 60 * 1000));
            if(field.range == 'week'){
                condition = new Object();
                op = operator.between;
                condition[op] = [Date.parse(last.datetime().toString()), Date.parse(currentDate.datetime().toString())];
                conditionKey['finish_date'] = condition;
            }
            
            condition = new Object();
            op = operator.eq;
            condition[op] = "1";
            conditionKey['status'] = condition;
            
            condition = new Object();
            op = operator.eq;
            condition[op] = "1";
            conditionKey['is_finish'] = condition;
            
            orderProductAttributes.where = [conditionProductKey];
            orderProductAttributes.attributes=['review_score'];
            orderProductAttributes.include={
                model: db.detailOrderStore,
                as: 'store',
                attributes: [],
                where: [conditionKey]
            };
            db.detailOrderProduct.findAll(orderProductAttributes).then(dataCurrent=>{
                let objectResponse = new Object();
                objectResponse.maxScore = 5;
                if(dataCurrent == null){
                    objectResponse.currentScore = 0;
                    log.order.info("Review not found");
                }else{
                    let dataCurrentScore = JSON.parse(JSON.stringify(dataCurrent));
                    if(dataCurrentScore.length > 0){
                        let sumCurrentReviewScore = 0;
                        for(let i = 0; i<dataCurrentScore.length; i++){
                            sumCurrentReviewScore = sumCurrentReviewScore+dataCurrentScore[i].review_score;
                        }
                        objectResponse.currentScore = sumCurrentReviewScore/dataCurrentScore.length;
                    }else{
                        objectResponse.currentScore = 0;                        
                    }
                    condition = new Object();
                    op = operator.between;
                    condition[op] = [Date.parse(lastMonthAgo.datetime().toString()), Date.parse(currentDateMonthAgo.datetime().toString())];
                    conditionKey['finish_date'] = condition;
                    
                    orderProductAttributes.where = [conditionProductKey];
                    orderProductAttributes.attributes=['review_score'];
                    orderProductAttributes.include={
                        model: db.detailOrderStore,
                        as: 'store',
                        attributes: [],
                        where: [conditionKey]
                    };
                    
                    db.detailOrderProduct.findAll(orderProductAttributes).then(dataBefore=>{
                        if(dataBefore == null){
                            objectResponse.scoreBefore = 0;
                            log.order.info("Review not found");
                        }else{
                            let dataScoreBefore = JSON.parse(JSON.stringify(dataBefore));
                            if(dataScoreBefore.length > 0){
                                let sumReviewScoreBefore = 0;
                                for(let i = 0; i<dataScoreBefore.length; i++){
                                    sumReviewScoreBefore = sumReviewScoreBefore+dataCurrentScore[i].review_score;
                                }
                                objectResponse.scoreBefore = sumReviewScoreBefore/dataScoreBefore.length;
                            }else{
                                objectResponse.scoreBefore = 0;                        
                            }
                        }
                        result("success", 200, objectResponse);
                    }).catch(err=>{
                        log.order.error(err);
                        result("Internal Server Error", 500, null);
                    });
                    
                }
            }).catch(err=>{
                log.order.error(err);
                result("Internal Server Error", 500, null);
            });
        }
    }).catch(err=>{
        log.order.error(err);
        result("Internal Server Error", 500, null);
    });
}


exports.countProductBestSeller = function(security,field,result){
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
            
            let currentDate = new Date();
            let currentMonth = currentDate.getMonth()+1;
            let currentYear = currentDate.getFullYear();
            condition = new Object();
            op = operator.between;
            condition[op] = [sequelize.where(sequelize.fn("month", sequelize.col("finish_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("finish_date")), currentYear)];
            conditionKey[''] = condition;
            
            condition = new Object();
            op = operator.eq;
            condition[op] = "1";
            conditionKey['status'] = condition;
            
            condition = new Object();
            op = operator.eq;
            condition[op] = "1";
            conditionKey['is_finish'] = condition;
            
            condition = new Object();
            op = operator.eq;
            condition[op] = "1";
            conditionKey['is_paid'] = condition;
            
            orderProductAttributes.where = [conditionProductKey];
            orderProductAttributes.attributes={include:[[sequelize.fn('COUNT', sequelize.col('id_product_varian')), 'total_selling']],exclude:['id_order_product','id', 'id_order_store']};
            orderProductAttributes.include={
                model: db.detailOrderStore,
                as: 'store',
                attributes: [],
                where: [conditionKey]
            };
            orderProductAttributes.group = ['id_product_varian'];
            orderProductAttributes.limit = 5;
            db.detailOrderProduct.findAll(orderProductAttributes).then(dataCurrent=>{
                if(dataCurrent == null){
                    log.order.info("Data not found");
                    result("Not Found", 404, null);
                }else{
//                    let dataCurrentBestSeller = JSON.parse(JSON.stringify(dataCurrent));
                    security.encrypt(dataCurrent)
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
    }).catch(err=>{
        log.order.error(err);
        result("Internal Server Error", 500, null);
    });
}

exports.countCategoryBestSeller = function(security,field,result){
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
            
            let currentDate = new Date();
            let currentMonth = currentDate.getMonth()+1;
            let currentYear = currentDate.getFullYear();
            condition = new Object();
            op = operator.between;
            condition[op] = [sequelize.where(sequelize.fn("month", sequelize.col("finish_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("finish_date")), currentYear)];
            conditionKey[''] = condition;
            
            condition = new Object();
            op = operator.eq;
            condition[op] = "1";
            conditionKey['status'] = condition;
            
            condition = new Object();
            op = operator.eq;
            condition[op] = "1";
            conditionKey['is_finish'] = condition;
            
            condition = new Object();
            op = operator.eq;
            condition[op] = "1";
            conditionKey['is_paid'] = condition;
            
            orderProductAttributes.where = [conditionProductKey];
//            orderProductAttributes.attributes={include:[[sequelize.fn('COUNT', sequelize.col('id_product_varian')), 'total_selling']],exclude:['id_order_product','id', 'id_order_store']};
            orderProductAttributes.attributes=['id_order_product'];
            orderProductAttributes.include={
                model: db.detailOrderStore,
                as: 'store',
                attributes: [],
                where: [conditionKey]
            };
//            ,{
//                model: db.product_varian,
//                as: 'varian',
//                attributes: ['id_product_varian'],
//                include:{
//                    model: db.product,
//                    as: 'product',
//                    attributes:['id_product'],
//                    include:{
//                        model: db.sub_category_product,
//                        as: 'subCategory',
//                        attributes:['id_sub_category',[sequelize.fn('COUNT', sequelize.col('varian->product->subCategory.id_sub_category')), 'total_selling']],
//                        group: ['id_sub_category']
//                    }
//                }
//            }
            let categoryAttributes = new Object();
            categoryAttributes.attributes=['categoryName', [sequelize.fn('COUNT', sequelize.col('tm_category_product.id_category')), 'total_selling']];
            categoryAttributes.group=['tm_category_product.id_category'];
            categoryAttributes.include=[{
                model: db.sub_category_product,
                as: 'subCategories',
                required: true,
                attributes: ['id_sub_category'],
                include: {
                    model: db.product,
                    as: 'products',
                    required: true,
                    attributes:['id_product'],
                    include: {
                        model: db.product_varian,
                        as: 'varian',
                        required: true,
                        attributes: ['id_product_varian'],
                        include:{
                            model: detailOrderProduct,
                            as: 'solds',
                            required: true,
                            where: [conditionProductKey],
                            include: {
                                model: db.detailOrderStore,
                                as: 'store',
                                attributes: [],
                                where: [conditionKey]
                            },
                            attributes: ['id_order_product']
                        }
                    }
                }
            }]
//            orderProductAttributes.group = ['id_product_varian'];
            orderProductAttributes.limit = 5;
//            db.detailOrderProduct.findAll(orderProductAttributes).then(dataCurrent=>{
                
            db.category_product.findAll(categoryAttributes).then(dataCurrent=>{
                let objectResponse = new Object();
                if(dataCurrent == null){
                    log.order.info("Data not found");
                }else{
//                    let dataCurrentBestSeller = JSON.parse(JSON.stringify(dataCurrent));
//                    console.log(dataCurrentBestSeller);
                    security.encrypt(dataCurrent)
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
    }).catch(err=>{
        log.order.error(err);
        result("Internal Server Error", 500, null);
    });
}

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