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
db.category_product = require("./category_product.model.js")(sequelize, Sequelize);
db.sub_category_product = require("./sub_category_product.model.js")(sequelize, Sequelize);
db.further_sub_category_product = require("./further_sub_category_product.model.js")(sequelize, Sequelize);

module.exports = db;

