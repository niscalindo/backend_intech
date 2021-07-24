        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const productLike = db.product_like;
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
exports.find = function(security,findBy,id,scope, result){
    let currentDate = new Date();
    let whereCondition = new Object();
    let condition = new Object();
    let includeProduct = {
        model:db.product,
        as:'product',
        include:
            {
                model:db.users,
                as:'owner',
                attributes:{exclude: ['password','username','code','email','idCitizen','photoIdCitizen','photoId','serialNumber','dob','fullName','phoneNumber','dateCreated']},
                include:
                {
                    model:db.tr_address,
                    as:'addresses',
                    include:[
                        {
                            model:db.province,
                            as: 'province',
                        },
                        {
                            model:db.regency,
                            as: 'city'
                        },
                        {
                            model:db.district,
                            as:'district'
                        }
                    ],
                    required: true
                }
            }
        
    };
    if(findBy == "user"){
        condition[operator.eq] = id;
        whereCondition["id_user"]=condition
    }else{
        condition[operator.eq] = id;
        whereCondition["id_product_varian"]=condition;
    }
    let conditionObject = {
        attributes:{
            exclude: ['dateCreated']
        },
        where:[whereCondition]
    };
    if(scope!="null" && scope == "all"){
        conditionObject.include={
            model:db.product_varian,
            as: 'products_liked',
            include:[{
                    model: db.detail_promo,
                    as: 'detailPromo',
                    attributes:{exclude: ['createdBy', 'dateCreated']},
                    required: false,
                    include:[
                        {
                            model: db.promo,
                            as: 'promo',
                            attributes:{exclude: ['createdBy', 'dateCreated']},
                            required: false,
                            where:[
                                    {
                                        date_started:{
                                            [operator.lte]:Date.parse(currentDate.datetime().toString())
                                        }
                                    },
                                    {
                                        date_ended:{
                                            [operator.gte]:Date.parse(currentDate.datetime().toString())
                                        }
                                    }
                            ]
                        }
                     ]
                },includeProduct]
        }
    }
    productLike.findAll(conditionObject).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            log.productLike.error(error);
            result("Encryption Failed", 1000, null);
        });
    }).catch(err=>{
        log.productLike.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.create = function(newData,security, result){
    productLike.count({
        attributes:{
            exclude: ['createdBy', 'dateCreated']
        },
        where: {
                id_user:{
                    [operator.eq]:newData.idUser
                },
                id_product_varian:{
                    [operator.eq]:newData.idProductVarian
                }
            }
    }).then(data=>{
        if(data > 0){
            productLike.destroy({
                where: {
                        id_user:{
                            [operator.eq]:newData.idUser
                        },
                        id_product_varian:{
                            [operator.eq]:newData.idProductVarian
                        }
                    }
            }).then(data=>{
                result("success",201,data);
            }).catch(err=>{
                log.productLike.error(err);
                result("Internal Server Error", 500, null);
            });
        }else{
            newData['dateCreated'] = new Date();   
            productLike.create(newData).then(data=>{
                security.encrypt(data)
                .then(function(encryptedData){
                    let newInsertedId = encryptedData.dataValues.id;
                    let newData = new Object();
                    newData['id'] = newInsertedId;
                    result("success",201,newData);
                }).catch(function(error){
                    log.productLike.error(error);
                    result("Encryption Failed", 1000, null);
                });        
            }).catch(err=>{
                log.productLike.error(err);
                result("Internal Server Error", 500, null);
            });             
        }       
    }).catch(err=>{
        log.productLike.error(err);
        result("Internal Server Error", 500, null);
    });
};