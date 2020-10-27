/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

module.exports = function(app){
    var userController = require('../controller/UserController');
    var usersController = require('../controller/UsersController');
    var categoryController = require('../controller/CategoryProductController');
    var unitController = require('../controller/UnitController');
    var sliderController = require('../controller/SliderController');
    var brandController = require('../controller/BrandController');
    var fileUploadController = require('../controller/FileUploadController');
    var productController = require('../controller/ProductController');
    var captchaController = require('../controller/CaptchaController');
    var subCategoryController = require('../controller/SubCategoryProductController');
    var furtherSubCategoryController = require('../controller/FurtherSubCategoryProductController');
    
    var auth = require('./auth');
    app.route('/users/admin/login').post(userController.login);
    app.route('/users/admin/find').get(auth.isAunthenticated,userController.find);
    app.route('/users/customer/login').post(usersController.login);
    app.route('/users/customer/find').get(auth.isAunthenticated,usersController.find);
    app.route('/users/customer').put(auth.isAunthenticated,usersController.update);
    app.route('/users/customer/verification-code').put(usersController.addVerificationCode);
    app.route('/users/customer/verification-code/find').get(usersController.findVerificationCode);
    
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
    app.route('/brands').get(auth.isAunthenticated,brandController.getAll);
    app.route('/brands').post(auth.isAunthenticated,brandController.create);
    app.route('/brands').put(auth.isAunthenticated,brandController.update);
    app.route('/brands/find').get(auth.isAunthenticated,brandController.find);
    app.route('/files').get(auth.isAunthenticated,fileUploadController.getAll);
    app.route('/files').post(auth.isAunthenticated,fileUploadController.create);
    app.route('/files').put(auth.isAunthenticated,fileUploadController.update);
    app.route('/files/find').get(auth.isAunthenticated,fileUploadController.find);
    app.route('/products').get(auth.isAunthenticated,productController.getAll);
    app.route('/products').post(auth.isAunthenticated,productController.create);
    app.route('/products').put(auth.isAunthenticated,productController.update);
    app.route('/products/find').get(auth.isAunthenticated,productController.find);
    app.route('/sliders').get(auth.isAunthenticated,sliderController.getAll);
    app.route('/sliders').post(auth.isAunthenticated,sliderController.create);
    app.route('/sliders').put(auth.isAunthenticated,sliderController.update);
    app.route('/sliders/find').get(auth.isAunthenticated,sliderController.find);
    
    app.route('/captcha').post(captchaController.create);
    app.route('/captcha/compare').get(captchaController.find);
}

