        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const productModel = db.product;
const productVarianModel = db.product_varian;
const pictures = db.pictures;
const brand = db.brand;
const Sequelize = db.Sequelize;
const operator =  Sequelize.Op;
const sequelize = db.sequelize;
const transaction = sequelize.transaction;
const log = require('../utils/logger');

exports.countRecords = function (param, result) {
    let conditionKey = new Object();
    let conditionKeyVarian = new Object();
    let isLookInStatus = false;
    if(param.countAll == 'undefined' || param.countAll == null){
        if (typeof param.name != 'undefined' && typeof param.name != null) {
            op = operator.or;
            let condition = new Object();
            let findInName = new Object();
            findInName[operator.substring] = decodeURI(param.name);
            let conditionName = new Object();
            conditionName['product_name'] = findInName;
            let findInSku= new Object();
            findInSku[operator.substring] = decodeURI(param.name);
            let conditionSku= new Object();
            conditionSku['$varian.sku$'] = findInSku;
            condition[operator.or] = [conditionName, conditionSku];
            conditionKey = condition;
        }else{
            if(typeof param.status != "undefined" && typeof param.status != null){
                isLookInStatus = true;      
            }else{
                if(typeof param.stock != "undefined" && typeof param.stock!= null){
                    let condition = new Object();
                    condition[operator.eq] = parseInt(param.stock);
                    conditionKey['$varian.stock$'] = condition;
                }
            }
        }
        if(param.idSubCategory != "undefined" && param.idSubCategory != null){
            let condition = new Object();
            condition[operator.eq] = parseInt(param.idSubCategory);
            conditionKey['id_sub_category'] = condition;
        }
        if(param.idFurtherSubCategory != "undefined" && param.idFurtherSubCategory != null){
            let condition = new Object();
            condition[operator.eq] = parseInt(param.idFurtherSubCategory);
            conditionKey['id_further_sub_category'] = condition;
        }
    }else{
        if(typeof param.status != "undefined" && typeof param.status != null){
            isLookInStatus = true;      
        }
    }
    let condition2 = new Object();
    if(!isLookInStatus){
        condition2[operator.ne] = '0';
        conditionKey['status'] = condition2;
    }else{
        condition2[operator.eq] = param.status;
        conditionKey['status'] = condition2;
    }

//    let conditionVarian = new Object();
//    conditionVarian[operator.eq] = '1';
//    conditionKeyVarian['status'] = conditionVarian;
    let options = new Object();
    if(!isLookInStatus){
        options = {
            where: [conditionKey],
            include: [
                {
                    model: productVarianModel,
                    as: 'varian',
                    attributes: [],
                    required: false
                }
            ],
            distinct: true,
            col: 'id_product'
        }
    }else{
        options = {
            where: [conditionKey]
        }
    }
    productModel.count(options).then(data => {
        result("success", 200, data);
    }).catch(err => {
        log.product.error(err);
        result("Internal Server Error", 500, null);
    });
}
exports.find = function (security, order, orderBy, offset, limit, field,scope, result) {
    let op = null;
    let conditionKey = new Object();
    let conditionKeyVarian = new Object();
    let isLookInStatus = false;
    let useRawQuery = false;
    let rawQuery = null;
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "status") isLookInStatus = true;
        if(key === "name"){
            useRawQuery = true;
            if(field.idCategory != "undefined" && field.idCategory != null){
                rawQuery = "SELECT `tm_product`.*, `varian`.`date_created` AS `varian.dateCreated`, `varian`.`status` AS `varian.status`, `varian`.`created_by` AS `varian.createdBy`, `varian`.`id_product_varian` AS `varian.id`, `varian`.`id_product` AS `varian.id_product`, `varian`.`option_name` AS `varian.optionName`, `varian`.`sku` AS `varian.sku`, `varian`.`varian_name` AS `varian.varianName`, `varian`.`price` AS `varian.price`, `varian`.`stock` AS `varian.stock` FROM (SELECT `tm_product`.`date_created` AS `dateCreated`, `tm_product`.`status`, `tm_product`.`id_product` AS `id`, `tm_product`.`product_name` AS `name`, `tm_product`.`description`, `tm_product`.`unit`, `tm_product`.`id_sub_category` AS `idSubCategory`, `tm_product`.`sub_category_name` AS `subCategoryName`, `tm_product`.`category_name` AS `categoryName`, `tm_product`.`id_further_sub_category` AS `idFurtherSubCategory`, `tm_product`.`id_brand` AS `idBrand`, `tm_product`.`brand_name` AS `brandName`, `tm_product`.`further_sub_category_name` AS `furtherSubCategoryName`, `tm_product`.`default_picture` AS `defaultPicture`, `tm_product`.`wholesale_min_buy` AS `wholesaleMinBuy`, `tm_product`.`wholesale_max_buy` AS `wholesaleMaxBuy`, `tm_product`.`wholesale_price` AS `wholesalePrice`, `tm_product`.`packet_weight` AS `packetWeight`, `tm_product`.`packet_weight_unit` AS `packetWeightUnit`, `tm_product`.`packet_wide` AS `packetWide`, `tm_product`.`packet_long` AS `packetLong`, `tm_product`.`packet_tall` AS `packetTall`, `tm_product`.`preorder`, `tm_product`.`condition`, `tm_product`.`id_brand`, `tm_product`.`id_product` FROM `tm_product` AS `tm_product` inner join  `tm_product_varian` AS `varian` ON `tm_product`.`id_product` = `varian`.`id_product` inner join tm_sub_category_product on `tm_product`.`id_sub_category` = `tm_sub_category_product`.`id_sub_category` WHERE (((`tm_product`.`product_name` LIKE '%"+decodeURI(value)+"%'  OR `varian`.`sku` LIKE '%"+decodeURI(value)+"%') AND (`tm_product`.`status` != '0' AND `tm_sub_category_product`.`id_category` = '"+field.idCategory+"'))) group by `tm_product`.`id_product` ORDER BY `tm_product`.`id_product` DESC LIMIT "+parseInt(offset)+", "+parseInt(limit)+") AS `tm_product` INNER JOIN `tm_product_varian` AS `varian` ON `tm_product`.`id` = `varian`.`id_product` AND (`varian`.`status` != '0') ORDER BY `id` DESC;";
            }else if(field.idSubCategory != "undefined" && field.idSubCategory != null){
                rawQuery = "SELECT `tm_product`.*, `varian`.`date_created` AS `varian.dateCreated`, `varian`.`status` AS `varian.status`, `varian`.`created_by` AS `varian.createdBy`, `varian`.`id_product_varian` AS `varian.id`, `varian`.`id_product` AS `varian.id_product`, `varian`.`option_name` AS `varian.optionName`, `varian`.`sku` AS `varian.sku`, `varian`.`varian_name` AS `varian.varianName`, `varian`.`price` AS `varian.price`, `varian`.`stock` AS `varian.stock` FROM (SELECT `tm_product`.`date_created` AS `dateCreated`, `tm_product`.`status`, `tm_product`.`id_product` AS `id`, `tm_product`.`product_name` AS `name`, `tm_product`.`description`, `tm_product`.`unit`, `tm_product`.`id_sub_category` AS `idSubCategory`, `tm_product`.`sub_category_name` AS `subCategoryName`, `tm_product`.`category_name` AS `categoryName`, `tm_product`.`id_further_sub_category` AS `idFurtherSubCategory`, `tm_product`.`id_brand` AS `idBrand`, `tm_product`.`brand_name` AS `brandName`, `tm_product`.`further_sub_category_name` AS `furtherSubCategoryName`, `tm_product`.`default_picture` AS `defaultPicture`, `tm_product`.`wholesale_min_buy` AS `wholesaleMinBuy`, `tm_product`.`wholesale_max_buy` AS `wholesaleMaxBuy`, `tm_product`.`wholesale_price` AS `wholesalePrice`, `tm_product`.`packet_weight` AS `packetWeight`, `tm_product`.`packet_weight_unit` AS `packetWeightUnit`, `tm_product`.`packet_wide` AS `packetWide`, `tm_product`.`packet_long` AS `packetLong`, `tm_product`.`packet_tall` AS `packetTall`, `tm_product`.`preorder`, `tm_product`.`condition`, `tm_product`.`id_brand`, `tm_product`.`id_product` FROM `tm_product` AS `tm_product` inner join  `tm_product_varian` AS `varian` ON `tm_product`.`id_product` = `varian`.`id_product` WHERE (((`tm_product`.`product_name` LIKE '%"+decodeURI(value)+"%'  OR `varian`.`sku` LIKE '%"+decodeURI(value)+"%') AND (`tm_product`.`status` != '0' AND `tm_product`.`id_sub_category` = '"+field.idSubCategory+"'))) group by `tm_product`.`id_product` ORDER BY `tm_product`.`id_product` DESC LIMIT "+parseInt(offset)+", "+parseInt(limit)+") AS `tm_product` INNER JOIN `tm_product_varian` AS `varian` ON `tm_product`.`id` = `varian`.`id_product` AND (`varian`.`status` != '0') ORDER BY `id` DESC;";
            }else if(field.idFurtherSubCategory != "undefined" && field.idFurtherSubCategory != null){
                rawQuery = "SELECT `tm_product`.*, `varian`.`date_created` AS `varian.dateCreated`, `varian`.`status` AS `varian.status`, `varian`.`created_by` AS `varian.createdBy`, `varian`.`id_product_varian` AS `varian.id`, `varian`.`id_product` AS `varian.id_product`, `varian`.`option_name` AS `varian.optionName`, `varian`.`sku` AS `varian.sku`, `varian`.`varian_name` AS `varian.varianName`, `varian`.`price` AS `varian.price`, `varian`.`stock` AS `varian.stock` FROM (SELECT `tm_product`.`date_created` AS `dateCreated`, `tm_product`.`status`, `tm_product`.`id_product` AS `id`, `tm_product`.`product_name` AS `name`, `tm_product`.`description`, `tm_product`.`unit`, `tm_product`.`id_sub_category` AS `idSubCategory`, `tm_product`.`sub_category_name` AS `subCategoryName`, `tm_product`.`category_name` AS `categoryName`, `tm_product`.`id_further_sub_category` AS `idFurtherSubCategory`, `tm_product`.`id_brand` AS `idBrand`, `tm_product`.`brand_name` AS `brandName`, `tm_product`.`further_sub_category_name` AS `furtherSubCategoryName`, `tm_product`.`default_picture` AS `defaultPicture`, `tm_product`.`wholesale_min_buy` AS `wholesaleMinBuy`, `tm_product`.`wholesale_max_buy` AS `wholesaleMaxBuy`, `tm_product`.`wholesale_price` AS `wholesalePrice`, `tm_product`.`packet_weight` AS `packetWeight`, `tm_product`.`packet_weight_unit` AS `packetWeightUnit`, `tm_product`.`packet_wide` AS `packetWide`, `tm_product`.`packet_long` AS `packetLong`, `tm_product`.`packet_tall` AS `packetTall`, `tm_product`.`preorder`, `tm_product`.`condition`, `tm_product`.`id_brand`, `tm_product`.`id_product` FROM `tm_product` AS `tm_product` inner join  `tm_product_varian` AS `varian` ON `tm_product`.`id_product` = `varian`.`id_product` WHERE (((`tm_product`.`product_name` LIKE '%"+decodeURI(value)+"%'  OR `varian`.`sku` LIKE '%"+decodeURI(value)+"%') AND (`tm_product`.`status` != '0' AND `tm_product`.`id_further_sub_category` = '"+field.idFurtherSubCategory+"'))) group by `tm_product`.`id_product` ORDER BY `tm_product`.`id_product` DESC LIMIT "+parseInt(offset)+", "+parseInt(limit)+") AS `tm_product` INNER JOIN `tm_product_varian` AS `varian` ON `tm_product`.`id` = `varian`.`id_product` AND (`varian`.`status` != '0') ORDER BY `id` DESC;";
            }else{
                if(field.createdBy != "undefined" && field.createdBy != null){
//                    rawQuery = "SELECT `tm_product`.*, `varian`.`date_created` AS `varian.dateCreated`, `varian`.`status` AS `varian.status`, `varian`.`created_by` AS `varian.createdBy`, `varian`.`id_product_varian` AS `varian.id`, `varian`.`id_product` AS `varian.id_product`, `varian`.`option_name` AS `varian.optionName`, `varian`.`sku` AS `varian.sku`, `varian`.`varian_name` AS `varian.varianName`, `varian`.`price` AS `varian.price`, `varian`.`stock` AS `varian.stock` FROM (SELECT `tm_product`.`date_created` AS `dateCreated`, `tm_product`.`status`, `tm_product`.`id_product` AS `id`, `tm_product`.`product_name` AS `name`, `tm_product`.`description`, `tm_product`.`unit`, `tm_product`.`id_sub_category` AS `idSubCategory`, `tm_product`.`sub_category_name` AS `subCategoryName`, `tm_product`.`category_name` AS `categoryName`, `tm_product`.`id_further_sub_category` AS `idFurtherSubCategory`, `tm_product`.`id_brand` AS `idBrand`, `tm_product`.`brand_name` AS `brandName`, `tm_product`.`further_sub_category_name` AS `furtherSubCategoryName`, `tm_product`.`default_picture` AS `defaultPicture`, `tm_product`.`wholesale_min_buy` AS `wholesaleMinBuy`, `tm_product`.`wholesale_max_buy` AS `wholesaleMaxBuy`, `tm_product`.`wholesale_price` AS `wholesalePrice`, `tm_product`.`packet_weight` AS `packetWeight`, `tm_product`.`packet_weight_unit` AS `packetWeightUnit`, `tm_product`.`packet_wide` AS `packetWide`, `tm_product`.`packet_long` AS `packetLong`, `tm_product`.`packet_tall` AS `packetTall`, `tm_product`.`preorder`, `tm_product`.`condition`, `tm_product`.`id_brand`, `tm_product`.`id_product` FROM `tm_product` AS `tm_product` inner join  `tm_product_varian` AS `varian` ON `tm_product`.`id_product` = `varian`.`id_product` WHERE (((`tm_product`.`product_name` LIKE '%"+decodeURI(value)+"%'  OR `varian`.`sku` LIKE '%"+decodeURI(value)+"%') AND `tm_product`.`status` != '0' AND `tm_product`.`created_by` = '"+field.createdBy+"')) group by `tm_product`.`id_product` ORDER BY `tm_product`.`id_product` DESC LIMIT "+parseInt(offset)+", "+parseInt(limit)+") AS `tm_product` INNER JOIN `tm_product_varian` AS `varian` ON `tm_product`.`id` = `varian`.`id_product` AND (`varian`.`status` != '0') ORDER BY `id` DESC;";
                    rawQuery = "SELECT \n\
`tm_product`.*, \n\
`varian`.`date_created` AS `varian.dateCreated`, \n\
`varian`.`status` AS `varian.status`, \n\
`varian`.`created_by` AS `varian.createdBy`, \n\
`varian`.`id_product_varian` AS `varian.id`, \n\
`varian`.`id_product` AS `varian.id_product`, \n\
`varian`.`option_name` AS `varian.optionName`, \n\
`varian`.`sku` AS `varian.sku`, \n\
`varian`.`varian_name` AS `varian.varianName`, \n\
`varian`.`price` AS `varian.price`, \n\
`varian`.`stock` AS `varian.stock`,\n\
`varian->viewer`.`id` AS `varian.viewer.id`, \n\
`varian->viewer`.`date_created` AS `varian.viewer.dateCreated`, \n\
`varian->viewer`.`id_viewer` AS `varian.viewer.idViewer`, \n\
`varian->viewer`.`id_product_varian` AS `varian.viewer.idProduct`, \n\
`varian->likes`.`id_user` AS `varian.likes.idUser`, \n\
`varian->likes`.`id` AS `varian.likes.id`, \n\
`varian->likes`.`id_product_varian` AS `varian.likes.idProductVarian`, \n\
`varian->likes`.`id_product_varian` AS `varian.likes.id_product_varian`, \n\
`varian->likes`.`id_user` AS `varian.likes.id_user`, \n\
`varian->solds`.`id_order_product` AS `varian.solds.id`, \n\
`varian->solds`.`id_order_store` AS `varian.solds.id_order_store`, \n\
`varian->solds`.`id_product_varian` AS `varian.solds.idProductVarian`, \n\
`varian->solds`.`product_name` AS `varian.solds.productName`, \n\
`varian->solds`.`product_image` AS `varian.solds.productImage`, \n\
`varian->solds`.`product_price` AS `varian.solds.productPrice`, \n\
`varian->solds`.`discount_amount` AS `varian.solds.discountAmount`, \n\
`varian->solds`.`price_after_discount` AS `varian.solds.priceAfterDiscount`, \n\
`varian->solds`.`quantity` AS `varian.solds.quantity`, \n\
`varian->solds`.`packet_weight` AS `varian.solds.packetWeight`, \n\
`varian->solds`.`review_score` AS `varian.solds.reviewScore`, \n\
`varian->solds`.`review` AS `varian.solds.review`, \n\
`varian->solds`.`review_pictures` AS `varian.solds.reviewPictures`, \n\
`varian->solds`.`review_date` AS `varian.solds.reviewDate`, \n\
`varian->solds`.`review_respon_date` AS `varian.solds.reviewResponDate`, \n\
`varian->solds`.`review_respon` AS `varian.solds.reviewRespon`, \n\
`varian->solds`.`is_review_private` AS `varian.solds.isReviewPrivate`, \n\
`varian->solds`.`packet_unit` AS `varian.solds.packetUnit`, \n\
`varian->solds->store`.`id_order_store` AS `varian.solds.store.id`, \n\
`varian->solds->store`.`id_store` AS `varian.solds.store.idStore`, \n\
`varian->solds->store`.`id_order` AS `varian.solds.store.id_order`, \n\
`varian->solds->store`.`store_name` AS `varian.solds.store.storeName`, \n\
`varian->solds->store`.`store_image` AS `varian.solds.store.storeImage`, \n\
`varian->solds->store`.`store_address` AS `varian.solds.store.storeAddress`, \n\
`varian->solds->store`.`delivery_name` AS `varian.solds.store.deliveryName`, \n\
`varian->solds->store`.`delivery_base_price` AS `varian.solds.store.deliveryBasePrice`, \n\
`varian->solds->store`.`delivery_price` AS `varian.solds.store.deliveryPrice`, \n\
`varian->solds->store`.`note` AS `varian.solds.store.note`, \n\
`varian->solds->store->order`.`status` AS `varian.solds.store.order.status`, \n\
`varian->solds->store->order`.`created_by` AS `varian.solds.store.order.createdBy`, \n\
`varian->solds->store->order`.`total_invoice` AS `varian.solds.store.order.totalInvoice`, \n\
`varian->solds->store->order`.`id_order` AS `varian.solds.store.order.id`, \n\
`varian->solds->store->order`.`payment_type` AS `varian.solds.store.order.paymentType`, \n\
`varian->solds->store->order`.`payment_bank_name` AS `varian.solds.store.order.paymentBankName`, \n\
`varian->solds->store->order`.`payment_bank_icon` AS `varian.solds.store.order.paymentBankIcon`, \n\
`varian->solds->store->order`.`payment_bank_number` AS `varian.solds.store.order.paymentBankNumber`, \n\
`varian->solds->store->order`.`cancel_reason` AS `varian.solds.store.order.cancelReason`, \n\
`varian->solds->store->order`.`received_by` AS `varian.solds.store.order.receivedBy`, \n\
`varian->solds->store->order`.`payment_time_limit` AS `varian.solds.store.order.paymentTimeLimit`, \n\
`varian->solds->store->order`.`delivery_max_date` AS `varian.solds.store.order.deliveryMaxDate`, \n\
`varian->solds->store->order`.`canceled_date` AS `varian.solds.store.order.canceledDate`, \n\
`varian->solds->store->order`.`buyer_address` AS `varian.solds.store.order.buyerAddress`, \n\
`varian->solds->store->order`.`receiver_name` AS `varian.solds.store.order.receiverName`, \n\
`varian->solds->store->order`.`receiver_phone_number` AS `varian.solds.store.order.receiverPhoneNumber`, \n\
`varian->solds->store->order`.`is_paid` AS `varian.solds.store.order.isPaid`, \n\
`varian->solds->store->order`.`paid_date` AS `varian.solds.store.order.paidDate`, \n\
`varian->solds->store->order`.`is_packed` AS `varian.solds.store.order.isPacked`, \n\
`varian->solds->store->order`.`packed_date` AS `varian.solds.store.order.packedDate`, \n\
`varian->solds->store->order`.`is_delivered` AS `varian.solds.store.order.isDelivered`, \n\
`varian->solds->store->order`.`delivered_date` AS `varian.solds.store.order.deliveredDate`, \n\
`varian->solds->store->order`.`is_finish` AS `varian.solds.store.order.isFinish`, \n\
`varian->solds->store->order`.`finish_date` AS `varian.solds.store.order.finishDate`, \n\
`varian->solds->store->order`.`created_by` AS `varian.solds.store.order.created_by` \n\
FROM ( \n\
    SELECT \n\
    `tm_product`.`date_created` AS `dateCreated`, \n\
    `tm_product`.`status`, \n\
    `tm_product`.`id_product` AS `id`, \n\
    `tm_product`.`product_name` AS `name`, \n\
    `tm_product`.`description`, \n\
    `tm_product`.`unit`, \n\
    `tm_product`.`id_sub_category` AS `idSubCategory`, \n\
    `tm_product`.`sub_category_name` AS `subCategoryName`, \n\
    `tm_product`.`category_name` AS `categoryName`, \n\
    `tm_product`.`id_further_sub_category` AS `idFurtherSubCategory`, \n\
    `tm_product`.`id_brand` AS `idBrand`, \n\
    `tm_product`.`brand_name` AS `brandName`, \n\
    `tm_product`.`further_sub_category_name` AS `furtherSubCategoryName`, \n\
    `tm_product`.`default_picture` AS `defaultPicture`, \n\
    `tm_product`.`wholesale_min_buy` AS `wholesaleMinBuy`, \n\
    `tm_product`.`wholesale_max_buy` AS `wholesaleMaxBuy`, \n\
    `tm_product`.`wholesale_price` AS `wholesalePrice`, \n\
    `tm_product`.`packet_weight` AS `packetWeight`, \n\
    `tm_product`.`packet_weight_unit` AS `packetWeightUnit`, \n\
    `tm_product`.`packet_wide` AS `packetWide`, \n\
    `tm_product`.`packet_long` AS `packetLong`, \n\
    `tm_product`.`packet_tall` AS `packetTall`, \n\
    `tm_product`.`preorder`, \n\
    `tm_product`.`condition`, \n\
    `tm_product`.`id_brand`, \n\
    `tm_product`.`id_product` \n\
    FROM `tm_product` AS `tm_product` inner join  `tm_product_varian` AS `varian` ON `tm_product`.`id_product` = `varian`.`id_product` \n\
    WHERE \n\
    (((`tm_product`.`product_name` LIKE '%"+decodeURI(value)+"%'  OR `varian`.`sku` LIKE '%"+decodeURI(value)+"%') AND `tm_product`.`status` != '0' AND `tm_product`.`created_by` = '"+field.createdBy+"')) group by `tm_product`.`id_product` ORDER BY `tm_product`.`id_product` DESC LIMIT "+parseInt(offset)+", "+parseInt(limit)+") \n\
    AS \n\
    `tm_product` INNER JOIN `tm_product_varian` AS `varian` ON `tm_product`.`id` = `varian`.`id_product` AND (`varian`.`status` != '0') \n\
    LEFT OUTER JOIN `tm_product_viewed` AS `varian->viewer` ON `varian`.`id_product_varian` = `varian->viewer`.`id_product_varian` \n\
    LEFT OUTER JOIN `product_like` AS `varian->likes` ON `varian`.`id_product_varian` = `varian->likes`.`id_product_varian` \n\
    LEFT OUTER JOIN `detail_order_product` AS `varian->solds` ON `varian`.`id_product_varian` = `varian->solds`.`id_product_varian` \n\
    LEFT OUTER JOIN `detail_order_store` AS `varian->solds->store` ON `varian->solds`.`id_order_store` = `varian->solds->store`.`id_order_store` \n\
    LEFT OUTER JOIN `order` AS `varian->solds->store->order` ON `varian->solds->store`.`id_order` = `varian->solds->store->order`.`id_order` \n\
    AND (`varian->solds->store->order`.`is_finish` = '1') ORDER BY `id` DESC;";
                }else{
                    rawQuery = "SELECT `tm_product`.*, `varian`.`date_created` AS `varian.dateCreated`, `varian`.`status` AS `varian.status`, `varian`.`created_by` AS `varian.createdBy`, `varian`.`id_product_varian` AS `varian.id`, `varian`.`id_product` AS `varian.id_product`, `varian`.`option_name` AS `varian.optionName`, `varian`.`sku` AS `varian.sku`, `varian`.`varian_name` AS `varian.varianName`, `varian`.`price` AS `varian.price`, `varian`.`stock` AS `varian.stock` FROM (SELECT `tm_product`.`date_created` AS `dateCreated`, `tm_product`.`status`, `tm_product`.`id_product` AS `id`, `tm_product`.`product_name` AS `name`, `tm_product`.`description`, `tm_product`.`unit`, `tm_product`.`id_sub_category` AS `idSubCategory`, `tm_product`.`sub_category_name` AS `subCategoryName`, `tm_product`.`category_name` AS `categoryName`, `tm_product`.`id_further_sub_category` AS `idFurtherSubCategory`, `tm_product`.`id_brand` AS `idBrand`, `tm_product`.`brand_name` AS `brandName`, `tm_product`.`further_sub_category_name` AS `furtherSubCategoryName`, `tm_product`.`default_picture` AS `defaultPicture`, `tm_product`.`wholesale_min_buy` AS `wholesaleMinBuy`, `tm_product`.`wholesale_max_buy` AS `wholesaleMaxBuy`, `tm_product`.`wholesale_price` AS `wholesalePrice`, `tm_product`.`packet_weight` AS `packetWeight`, `tm_product`.`packet_weight_unit` AS `packetWeightUnit`, `tm_product`.`packet_wide` AS `packetWide`, `tm_product`.`packet_long` AS `packetLong`, `tm_product`.`packet_tall` AS `packetTall`, `tm_product`.`preorder`, `tm_product`.`condition`, `tm_product`.`id_brand`, `tm_product`.`id_product` FROM `tm_product` AS `tm_product` inner join  `tm_product_varian` AS `varian` ON `tm_product`.`id_product` = `varian`.`id_product` WHERE (((`tm_product`.`product_name` LIKE '%"+decodeURI(value)+"%'  OR `varian`.`sku` LIKE '%"+decodeURI(value)+"%') AND `tm_product`.`status` != '0')) group by `tm_product`.`id_product` ORDER BY `tm_product`.`id_product` DESC LIMIT "+parseInt(offset)+", "+parseInt(limit)+") AS `tm_product` INNER JOIN `tm_product_varian` AS `varian` ON `tm_product`.`id` = `varian`.`id_product` AND (`varian`.`status` != '0') ORDER BY `id` DESC;";

                }
            }
        }else if(key === "stock"){
            useRawQuery = true;
            rawQuery = "SELECT `tm_product`.*, `varian`.`date_created` AS `varian.dateCreated`, `varian`.`status` AS `varian.status`, `varian`.`created_by` AS `varian.createdBy`, `varian`.`id_product_varian` AS `varian.id`, `varian`.`id_product` AS `varian.id_product`, `varian`.`option_name` AS `varian.optionName`, `varian`.`sku` AS `varian.sku`, `varian`.`varian_name` AS `varian.varianName`, `varian`.`price` AS `varian.price`, `varian`.`stock` AS `varian.stock` FROM (SELECT `tm_product`.`date_created` AS `dateCreated`, `tm_product`.`status`, `tm_product`.`id_product` AS `id`, `tm_product`.`product_name` AS `name`, `tm_product`.`description`, `tm_product`.`unit`, `tm_product`.`id_sub_category` AS `idSubCategory`, `tm_product`.`sub_category_name` AS `subCategoryName`, `tm_product`.`category_name` AS `categoryName`, `tm_product`.`id_further_sub_category` AS `idFurtherSubCategory`, `tm_product`.`id_brand` AS `idBrand`, `tm_product`.`brand_name` AS `brandName`, `tm_product`.`further_sub_category_name` AS `furtherSubCategoryName`, `tm_product`.`default_picture` AS `defaultPicture`, `tm_product`.`wholesale_min_buy` AS `wholesaleMinBuy`, `tm_product`.`wholesale_max_buy` AS `wholesaleMaxBuy`, `tm_product`.`wholesale_price` AS `wholesalePrice`, `tm_product`.`packet_weight` AS `packetWeight`, `tm_product`.`packet_weight_unit` AS `packetWeightUnit`, `tm_product`.`packet_wide` AS `packetWide`, `tm_product`.`packet_long` AS `packetLong`, `tm_product`.`packet_tall` AS `packetTall`, `tm_product`.`preorder`, `tm_product`.`condition`, `tm_product`.`id_brand`, `tm_product`.`id_product` FROM `tm_product` AS `tm_product` inner join  `tm_product_varian` AS `varian` ON `tm_product`.`id_product` = `varian`.`id_product` WHERE (( `varian`.`stock` ='"+decodeURI(value)+"' AND `tm_product`.`status` != '0' AND `varian`.`status` != '0')) group by `tm_product`.`id_product` ORDER BY `tm_product`.`id_product` DESC LIMIT "+parseInt(offset)+", "+parseInt(limit)+") AS `tm_product` INNER JOIN `tm_product_varian` AS `varian` ON `tm_product`.`id` = `varian`.`id_product` AND (`varian`.`status` != '0')  AND (`varian`.`stock` = 0) ORDER BY `id` DESC;";
        }else{
            op = operator.eq;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;
        }
    }
    
    let conditionVarian = new Object();
    conditionVarian[operator.ne] = '0';
    conditionKeyVarian['status'] = conditionVarian;
    if(!isLookInStatus){
        let condition = new Object();
        condition[operator.ne] = '0';
        conditionKey['status'] = condition;
    }
    
    let orderOption = Array();
    if(orderBy == "price"){
        orderOption[0] = [{
            model: productVarianModel,
            as: 'varian'
        },columnDictionary(orderBy), order];
    }else{
        orderOption[0] = [columnDictionary(orderBy), order];
    }
    let options = null;
    if(!useRawQuery){
        if(scope === 'all'){
            options = {
                attributes:{
                    exclude: ['createdBy']
                },
                order: orderOption,
                offset: parseInt(offset),
                limit: parseInt(limit), 
                where: [conditionKey],
                include:[
                    {
                        model: productVarianModel,
                        as: 'varian',
                        where: [conditionKeyVarian],
                        exclude: ['createdBy','dateCreated','status', 'id_product'],
                        include:[
                            {
                                model: db.product_viewed,
                                as: 'viewer',
                                required: false,
                                attributes: {exclude: ['id_product_varian', ]}
                            },
                            {
                                model: db.product_like,
                                as: 'likes',
                                attributes:{exclude: ['dateCreated']},
                                required: false
                            },
                            {
                                model: db.detailOrderProduct,
                                as: 'solds',
                                attributes:{exclude: ['dateCreated','id_product_varian']},
                                required: false,
                                include:
                                    {
                                        model: db.detailOrderStore,
                                        as: 'store',
                                        attributes:{exclude: ['dateCreated']},
                                        required: false,
                                        include:
                                            {
                                                model: db.order,
                                                as: 'order',
                                                attributes:{exclude: ['dateCreated']},
                                                where:[
                                                    {
                                                        is_finish: {
                                                            [operator.eq]: '1'
                                                        }
                                                    }
                                                ],
                                                required: false
                                            }
                                    }

                            }]
                    },
                    {
                        model: pictures,
                        as: 'pictures',
                        exclude: ['createdBy','dateCreated','status', 'id_product']
                    },
                    {
                        model: brand,
                        as: 'brand',
                        exclude: ['createdBy','dateCreated','status', 'id_product']
                    }
                ]
            }        
        }else{
            options = {
                attributes:{
                    exclude: ['createdBy']
                },
                subQuery : false,
                order: orderOption,
                offset: parseInt(offset),
                limit: parseInt(limit), 
                where: [conditionKey],
                include:[
                    {
                        model: productVarianModel,
                        as: 'varian',
                        where: [conditionKeyVarian],
                        exclude: ['createdBy','dateCreated','status', 'id_product'],
                        include:[
                            {
                                model: db.product_viewed,
                                as: 'viewer',
                                required: false,
                                attributes: {exclude: ['id_product_varian', ]}
                            },
                            {
                                model: db.product_like,
                                as: 'likes',
                                attributes:{exclude: ['dateCreated']},
                                required: false
                            },
                            {
                                model: db.detailOrderProduct,
                                as: 'solds',
                                attributes:{exclude: ['dateCreated','id_product_varian']},
                                required: false,
                                include:
                                    {
                                        model: db.detailOrderStore,
                                        as: 'store',
                                        attributes:{exclude: ['dateCreated']},
                                        required: false,
                                        include:
                                            {
                                                model: db.order,
                                                as: 'order',
                                                attributes:{exclude: ['dateCreated']},
                                                where:[
                                                    {
                                                        is_finish: {
                                                            [operator.eq]: '1'
                                                        }
                                                    }
                                                ],
                                                required: false
                                            }
                                    }

                            }]
                    }
                ]
            }
        }
        productModel.findAll(options).then(data=>{
            if(data == null){
                result("Not Found", 404, null);
            }else{
                security.encrypt(data)
                .then(function(encryptedData){
                    result("success", 200, encryptedData);
                }).catch(function(error){
                    log.product.error(error);
                    result("Encryption Failed", 1000, null);
                });            
            }
        }).catch(err=>{
            log.product.error(err);
            result("Internal Server Error", 500, null);
        });
    }else{
        sequelize.query(rawQuery, {
            type: Sequelize.QueryTypes.SELECT,
            model: productModel,
            mapToModel: true
        }).then(data => {
            let dataArray = new Array();
            let currentId = null;
            let product = null;
            let listVarians = new Array();
            let indexVarian = 0;
            let indexProduct = 0;
            data.forEach((element, index) => {
                if(data[index] != null && typeof data[index].dataValues === 'object'){
                    if(currentId == null || currentId != data[index].dataValues.id){
                        if(listVarians.length > 0){
                            product.varian = listVarians;
                            delete product['varian.dateCreated'];
                            delete product['varian.createdBy'];
                            delete product['varian.id'];
                            delete product['varian.optionName'];
                            delete product['varian.sku'];
                            delete product['varian.varianName'];
                            delete product['varian.price'];
                            delete product['varian.stock'];
                            delete product['varian.status'];
                            delete product['varian.id_product'];
                            delete product['id_brand'];
                            dataArray[indexProduct] = product;
                            indexProduct++;
                        }
                        product = data[index].dataValues;
                        currentId = product.id;
                        listVarians = new Array();
                        indexVarian = 0;
                    }else{
                        product = data[index].dataValues;
                    }
                    let productVarian = new Object();
                    productVarian.dateCreated = product['varian.dateCreated'];
                    productVarian.createdBy= product['varian.createdBy'];
                    productVarian.id= product['varian.id'];
                    productVarian.optionName = product['varian.optionName'];
                    productVarian.sku = product['varian.sku'];
                    productVarian.varianName= product['varian.varianName'];
                    productVarian.price = product['varian.price'];
                    productVarian.stock = product['varian.stock'];
//                    productVarian.viewer = product['varian.viewer'];
//                    console.log(productVarian);
                    listVarians[indexVarian] = productVarian;
                    indexVarian++;
                }
            });
            product.varian = listVarians;
            delete product['varian.dateCreated'];
            delete product['varian.createdBy'];
            delete product['varian.id'];
            delete product['varian.optionName'];
            delete product['varian.sku'];
            delete product['varian.varianName'];
            delete product['varian.price'];
            delete product['varian.stock'];
            delete product['varian.status'];
            delete product['varian.id_product'];
            delete product['id_brand'];
            dataArray[indexProduct] = product;
            
//            console.log(dataArray);
            security.encrypt(dataArray, "raw")
                    .then(function (encryptedData) {
                        result("success", 200, encryptedData);
                    }).catch(function (error) {
            log.product.error(error);
            result("Encryption Failed", 1000, null);
            });
        }).catch(err => {
            log.product.error(err);
            result("Internal Server Error", 500, null);
        });
    }
}
exports.getAll = function (security, orderBy, order, offset, limit, id, result) {
    let orderOption = Array();
    orderOption[0] = [columnDictionary(orderBy), order];
    
    productModel.findAll({
        attributes: {
            exclude: ['createdBy', 'dateCreated']
        },
        where: {
            status: {
                [operator.ne]: '0'
            },
            created_by: {
                [operator.eq]: id
            }
        },
        offset: parseInt(offset),
        limit: limit,
        order: orderOption,
        include: [
//            {model: supPubModel,
//                as: 'suplierPublisher',
//                attributes: {exclude: ['created_by', 'date_created', 'idDistributor']}
//            },
            {
                model: productVarianModel,
                as: 'varian',
                where: {
                    status: {
                        [operator.ne]: '0'
                    }
                },
                attributes: {exclude: ['createdBy', 'dateCreated']},
                include:[
                    {
                        model: db.product_viewed,
                        as: 'viewer',
                        required: false,
                        attributes: {exclude: ['id_product_varian', ]}
                    },
                    {
                        model: db.product_like,
                        as: 'likes',
                        attributes:{exclude: ['dateCreated']},
                        required: false
                    },
                    {
                        model: db.detailOrderProduct,
                        as: 'solds',
                        attributes:{exclude: ['dateCreated','id_product_varian']},
                        required: false,
                        include:
                            {
                                model: db.detailOrderStore,
                                as: 'store',
                                attributes:{exclude: ['dateCreated']},
                                required: false,
                                include:
                                    {
                                        model: db.order,
                                        as: 'order',
                                        attributes:{exclude: ['dateCreated']},
                                        where:[
                                            {
                                                is_finish: {
                                                    [operator.eq]: '1'
                                                }
                                            }
                                        ],
                                        required: false
                                    }
                            }
                        
                    }]
            }
        ]
    }).then(data => {
        security.encrypt(data)
                .then(function (encryptedData) {
                    result("success", 200, encryptedData);
                }).catch(function (error) {
            log.product.error(error);
            result("Encryption Failed", 1000, null);
        });
    }).catch(err => {
        log.product.error(err);
        result("Internal Server Error", 500, null);
    });
}

exports.create = function (newData, security, result) {
//    newData.status = '1';
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
            log.product.error(error);
            result("Encryption Failed", 1000, null);
        });
    }).catch(err => {
        log.product.error(err);
        result("Internal Server Error", 500, null);
    });
}
exports.update = function (newData, type, result) {
    if (type === "product") {
        productModel.update(
                newData,
                {
                    where: {id_product: parseInt(newData.id)}
                }).then(function (data) {
//            if (data[0] == 1) {
//                result("success", 200, data[0]);
//            } else {
//                result("no changes", 200, data[0]);
//            }
            if(newData.varian != "undefined" && newData.varian !=null){
                for (var i = 0; i < newData.varian.length; i++) {
                    newData.varian[i].id_product = newData.id;
                    newData.varian[i].dateCreated = new Date();
                    newData.varian[i].createdBy = newData.createdBy;
                }
                productVarianModel.bulkCreate(newData.varian,{updateOnDuplicate: Object.keys(productVarianModel.rawAttributes)}).then(function (data) {
                    if(newData.pictures != "undefined" && newData.pictures != null){
                        let arrayPictures = new Array();
                        let newPictures = newData.pictures;
                        for (var i = 0; i < newPictures.length; i++) {
                            let picture = new Object();
                            picture['id_product'] = newData.id;
                            picture['dateCreated'] = new Date();
                            if(newPictures[i].id != "undefined" && newPictures[i].id != null){
                                picture['id'] = newPictures[i].id;
                            }
                            picture['filename'] = newPictures[i].filename;
                            picture['createdBy'] = newData['createdBy'];
                            arrayPictures[i] = picture;
                        }
                        pictures.bulkCreate(arrayPictures,{updateOnDuplicate: Object.keys(pictures.rawAttributes)}).then(response => {
                            result("success", 200, null);
                        }).catch(err => {
                            log.product.error(err);
                            result("Internal Server Error", 500, null);
                        })            
                    }else{
                        result("success", 200, null);
                    }
                }).catch(err => {
                    log.product.error(err);
                    result("Internal Server Error", 500, null);
                });                
            }else{
                result("success", 200, null);                
            }
        }).catch(err => {
            log.product.error(err);
            result("Internal Server Error", 500, null);
        });
    } else if (type === "varian") {
        productVarianModel.update(
                newData,
                {
                    where: {id_product_varian: parseInt(newData.id)}
                }).then(function (data) {
            if (data[0] == 1) {
                result("success", 200, null);
            } else {
                result("success, nothing to change", 200, null);
            }
        }).catch(err => {
            log.product.error(err);
            result("Internal Server Error", 500, null);
        });
    }
}
//
//exports.findMaxNumerator= function( result){
//    categoryProduct.findOne({
//        attributes:[
//            [sequelize.fn('max', sequelize.col('id_category')), 'numerator']
//        ],
//        order: [
//            ['id_category', 'desc']
//        ]
//    }).then(data=>{
//        result("success", 200, data);
//    }).catch(err=>{
//        result(err.message, 500, null);
//    });
//}
function columnDictionary(key){
    if(key === 'id'){
        return 'id_product';
    }else if(key === 'idProduct'){
        return 'id_product';
    }else if(key === 'name'){
        return 'product_name';
    }else if(key === 'idSubCategory'){
        return 'id_sub_category';
    }else if(key === 'idFurtherSubCategory'){
        return 'id_further_sub_category';
    }else if(key === 'createdBy'){
        return 'created_by';
    }else if(key === 'stock'){
        return '$varian.stock$';
    }else{
        return key;
    }
}