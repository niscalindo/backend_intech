/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const dbConfig = require("../utils/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    define:{
        freezeTableName: true
    },
    pool:{
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    timezone:'+07:00'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tm_users = require("./tm_users.model.js")(sequelize, Sequelize);
db.promo = require("./tm_promo.model.js")(sequelize, Sequelize);
db.detail_promo = require("./tm_detail_promo.model.js")(sequelize, Sequelize);
db.unit = require("./unit.model.js")(sequelize, Sequelize);
db.brand = require("./brand.model.js")(sequelize, Sequelize);
db.province = require("./province.model.js")(sequelize, Sequelize);
db.regency = require("./regency.model.js")(sequelize, Sequelize);
db.district = require("./district.model.js")(sequelize, Sequelize);
db.slider = require("./tm_slider.model.js")(sequelize, Sequelize);
db.file_upload= require("./file_upload.model.js")(sequelize, Sequelize);
db.captcha = require("./captcha.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.pictures = require("./tm_pictures.model.js")(sequelize, Sequelize);
db.user_payment_account = require("./user_payment_account.model.js")(sequelize, Sequelize);
db.category_product = require("./category_product.model.js")(sequelize, Sequelize);
db.sub_category_product = require("./sub_category_product.model.js")(sequelize, Sequelize);
db.further_sub_category_product = require("./further_sub_category_product.model.js")(sequelize, Sequelize);
db.product_varian = require("./product_varian.model.js")(sequelize, Sequelize);
db.product.hasMany(db.product_varian,{as: 'varian', foreignKey: 'id_product'});
db.product.hasMany(db.pictures,{as: 'pictures', foreignKey: 'id_product'});
db.promo.hasMany(db.detail_promo,{as: 'details', foreignKey: 'id_promo'});
//db.product_varian.hasMany(db.detail_promo,{as: 'promos', foreignKey: 'id_product_varian'});
db.detail_promo.belongsTo(db.product_varian, {as: 'varian', foreignKey: 'id_product_varian'});
db.detail_promo.belongsTo(db.promo, {as: 'promo', foreignKey: 'id_promo'});
db.users.hasMany(db.file_upload,{as: 'files', foreignKey: 'id_user'});
db.file_upload.belongsTo(db.users, {as: 'uploader', foreignKey: 'id_user'});
db.product_varian.belongsTo(db.product, {as: 'product', foreignKey: 'id_product'});
db.product_varian.hasMany(db.detail_promo, {as: 'detailPromo', foreignKey: 'id_product_varian'});
db.product.belongsTo(db.brand, {as: 'brand', foreignKey: 'id_brand'});
db.product.belongsTo(db.sub_category_product,{as: 'subCategory', foreignKey: 'id_sub_category'});
db.product.belongsTo(db.users, {as: 'owner', foreignKey: 'created_by'});
db.further_sub_category_product.belongsTo(db.sub_category_product,{as: 'subCategory', foreignKey: 'id_sub_category'});
db.brand.belongsTo(db.sub_category_product,{as: 'subCategory', foreignKey: 'id_parent'});
db.brand.belongsTo(db.further_sub_category_product,{as: 'furtherSubCategory', foreignKey: 'id_parent'});
db.sub_category_product.belongsTo(db.category_product,{as: 'category', foreignKey: 'id_category'});
db.category_product.hasMany(db.sub_category_product,{as: 'subCategories', foreignKey: 'id_category'});
db.sub_category_product.hasMany(db.further_sub_category_product,{as: 'furtherSubCategories', foreignKey: 'id_sub_category'});
db.tr_address = require("./tr_address.model.js")(sequelize, Sequelize);
db.tr_address.belongsTo(db.province, {as: 'province', foreignKey: 'id_province'});
db.tr_address.belongsTo(db.regency, {as: 'city', foreignKey: 'id_city'});
db.tr_address.belongsTo(db.district, {as: 'district', foreignKey: 'id_district'});
db.tm_mail_in = require("./tm_mail_in.model.js")(sequelize, Sequelize);
db.tm_mail_out = require("./tm_mail_out.model.js")(sequelize, Sequelize);
db.tm_courier = require("./tm_courier.model.js")(sequelize, Sequelize);
db.tm_delivery = require("./tm_delivery.model.js")(sequelize, Sequelize);
module.exports = db;

