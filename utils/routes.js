/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

module.exports = function(app){
    var userController = require('../controller/UserController');
    var categoryController = require('../controller/CategoryProductController');
    var unitController = require('../controller/UnitController');
    var subCategoryController = require('../controller/SubCategoryProductController');
    var furtherSubCategoryController = require('../controller/FurtherSubCategoryProductController');
    
    var auth = require('./auth');
    app.route('/users/admin/login').post(userController.login);
    app.route('/users/admin/find').get(auth.isAunthenticated,userController.find);
    app.route('/categories-product').get(auth.isAunthenticated,categoryController.getAll);
    app.route('/categories-product').post(auth.isAunthenticated,categoryController.create);
    app.route('/categories-product').put(auth.isAunthenticated,categoryController.update);
    app.route('/categories-product/find').get(auth.isAunthenticated,categoryController.find);
    app.route('/subs-category-product').get(auth.isAunthenticated,subCategoryController.getAll);
    app.route('/subs-category-product').post(auth.isAunthenticated,subCategoryController.create);
    app.route('/subs-category-product').put(auth.isAunthenticated,subCategoryController.update);
    app.route('/subs-category-product/find').get(auth.isAunthenticated,subCategoryController.find);
    app.route('/furthers-sub-category-product').get(auth.isAunthenticated,furtherSubCategoryController.getAll);
    app.route('/furthers-sub-category-product').post(auth.isAunthenticated,furtherSubCategoryController.create);
    app.route('/furthers-sub-category-product').put(auth.isAunthenticated,furtherSubCategoryController.update);
    app.route('/furthers-sub-category-product/find').get(auth.isAunthenticated,furtherSubCategoryController.find);
    app.route('/units').get(auth.isAunthenticated,unitController.getAll);
    app.route('/units').post(auth.isAunthenticated,unitController.create);
    app.route('/units').put(auth.isAunthenticated,unitController.update);
    app.route('/units/find').get(auth.isAunthenticated,unitController.find);
}

