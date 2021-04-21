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
    var provinceController = require('../controller/ProvinceController');
    var regencyController = require('../controller/RegencyController');
    var districtController = require('../controller/DistrictController');
    var unitController = require('../controller/UnitController');
    var sliderController = require('../controller/SliderController');
    var brandController = require('../controller/BrandController');
    var productLikeController = require('../controller/ProductLikeController');
    var promoController = require('../controller/PromoController');
    var fileUploadController = require('../controller/FileUploadController');
    var productController = require('../controller/ProductController');
    var captchaController = require('../controller/CaptchaController');
    var subCategoryController = require('../controller/SubCategoryProductController');
    var furtherSubCategoryController = require('../controller/FurtherSubCategoryProductController');
    var addressController = require('../controller/AddressController');
    var mailinController = require('../controller/MailinController');
    var mailoutController = require('../controller/MailoutController');
    var userPaymentAccountController = require('../controller/UserPaymentAccountController');
    var courierController = require('../controller/CourierController');
    var deliveryController = require('../controller/DeliveryController');
    var chatController = require('../controller/ChatController');
    var followerController = require('../controller/FollowerController');
    var bankController = require('../controller/BankController');
    var virtualAccountController = require('../controller/VirtualAccountController');
    var auth = require('./auth');
    //route dibawah ini harus diupdate. dipisahkan berdasarkan role (admin atau user)
    app.route('/users/admin/login').post(userController.login);
    app.route('/users/admin/find').get(auth.isAunthenticated,userController.find);
    app.route('/users/admin/update').put(auth.isAunthenticated,userController.update);
    app.route('/bank').put(auth.isAunthenticated,bankController.update);
    app.route('/bank').post(auth.isAunthenticated,bankController.create);
    app.route('/bank').get(auth.isAunthenticated,bankController.getAll);
    //////////////////////////////////////////////////////////////////////////////
    
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
    app.route('/products/varian').get(auth.isAunthenticated,productController.getAllByVarian);
    app.route('/products/varian/find-one').get(auth.isAunthenticated,productController.findOne);
    app.route('/products/varian/like').post(auth.isAunthenticated,productLikeController.create);
    app.route('/products/varian/like/find').get(auth.isAunthenticated,productLikeController.find);
    app.route('/follower').post(auth.isAunthenticated,followerController.create);
    app.route('/follower/find').get(auth.isAunthenticated,followerController.find);
    app.route('/products').post(auth.isAunthenticated,productController.create);
    app.route('/products').put(auth.isAunthenticated,productController.update);
    app.route('/products/find').get(auth.isAunthenticated,productController.find);
    app.route('/sliders').get(auth.isAunthenticated,sliderController.getAll);
    app.route('/sliders').post(auth.isAunthenticated,sliderController.create);
    app.route('/sliders').put(auth.isAunthenticated,sliderController.update);
    app.route('/sliders/find').get(auth.isAunthenticated,sliderController.find);
    app.route('/mail-in').get(auth.isAunthenticated,mailinController.getAll);
    app.route('/mail-in').post(auth.isAunthenticated,mailinController.create);
    app.route('/mail-in').put(auth.isAunthenticated,mailinController.update);
    app.route('/mail-in/find').get(auth.isAunthenticated,mailinController.find);
    app.route('/mail-in/findMailOut').get(auth.isAunthenticated,mailinController.findMailOut);
    app.route('/mail-out').get(auth.isAunthenticated,mailoutController.getAll);
    app.route('/mail-out').post(auth.isAunthenticated,mailoutController.create);
    app.route('/mail-out').put(auth.isAunthenticated,mailoutController.update);
    app.route('/mail-out/find').get(auth.isAunthenticated,mailoutController.find);
    
    app.route('/captcha').post(captchaController.create);
    app.route('/captcha/compare').get(captchaController.find);
    
    app.route('/promos').post(auth.isAunthenticated,promoController.create);
    app.route('/promos/join').post(auth.isAunthenticated,promoController.joinPromo);
    app.route('/promos').get(auth.isAunthenticated,promoController.getAll);
    
    app.route('/payment-account').get(auth.isAunthenticated,userPaymentAccountController.getAll);
    app.route('/payment-account').post(auth.isAunthenticated,userPaymentAccountController.create);
    app.route('/payment-account').put(auth.isAunthenticated,userPaymentAccountController.update);
    app.route('/payment-account/find').get(auth.isAunthenticated,userPaymentAccountController.find);
    app.route('/user-addresses').get(auth.isAunthenticated,addressController.find);
    app.route('/user-addresses').post(auth.isAunthenticated,addressController.create);
    app.route('/user-addresses').put(auth.isAunthenticated,addressController.update);
    app.route('/user-addresses/find').get(auth.isAunthenticated,addressController.find);
    app.route('/provinces').get(auth.isAunthenticated,provinceController.getAll);
    // app.route('/provinces/find').get(auth.isAunthenticated,provinceController.find);
    app.route('/cities').get(auth.isAunthenticated,regencyController.find);
    // app.route('/cities/find').get(auth.isAunthenticated,regencyController.get);
    app.route('/districts').get(auth.isAunthenticated,districtController.find);
    app.route('/districts/find').get(auth.isAunthenticated,districtController.getById);
    // app.route('/districts/find').get(auth.isAunthenticated,districtController.get);

    app.route('/couriers').get(auth.isAunthenticated,courierController.getAll);
    app.route('/couriers').post(auth.isAunthenticated,courierController.create);
    app.route('/couriers').put(auth.isAunthenticated,courierController.update);
    app.route('/couriers/find').get(auth.isAunthenticated,courierController.find);
    app.route('/delivery').get(auth.isAunthenticated,deliveryController.getAll);
    app.route('/delivery').post(auth.isAunthenticated,deliveryController.create);
    app.route('/delivery').put(auth.isAunthenticated,deliveryController.update);
    app.route('/delivery/find').get(auth.isAunthenticated,deliveryController.find);
    app.route('/chat').get(auth.isAunthenticated,chatController.getAll);
    app.route('/chat').post(auth.isAunthenticated,chatController.create);
    app.route('/virtual-account').get(auth.isAunthenticated,virtualAccountController.getAll);
    app.route('/virtual-account').post(auth.isAunthenticated,virtualAccountController.create);
    app.route('/virtual-account').put(auth.isAunthenticated,virtualAccountController.update);
    app.route('/virtual-account/find').get(auth.isAunthenticated,virtualAccountController.find);
}

