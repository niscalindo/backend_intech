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
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tm_users = require("./tm_users.model.js")(sequelize, Sequelize);
db.unit = require("./unit.model.js")(sequelize, Sequelize);
db.brand = require("./brand.model.js")(sequelize, Sequelize);
db.captcha = require("./captcha.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);
db.category_product = require("./category_product.model.js")(sequelize, Sequelize);
db.sub_category_product = require("./sub_category_product.model.js")(sequelize, Sequelize);
db.further_sub_category_product = require("./further_sub_category_product.model.js")(sequelize, Sequelize);
db.further_sub_category_product.belongsTo(db.sub_category_product,{as: 'subCategory', foreignKey: 'id_sub_category'});
db.brand.belongsTo(db.sub_category_product,{as: 'subCategory', foreignKey: 'id_parent'});
db.brand.belongsTo(db.further_sub_category_product,{as: 'furtherSubCategory', foreignKey: 'id_parent'});
db.sub_category_product.belongsTo(db.category_product,{as: 'category', foreignKey: 'id_category'});
db.category_product.hasMany(db.sub_category_product,{as: 'subCategories', foreignKey: 'id_category'});
db.sub_category_product.hasMany(db.further_sub_category_product,{as: 'furtherSubCategories', foreignKey: 'id_sub_category'});
module.exports = db;

