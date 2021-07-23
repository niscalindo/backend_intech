        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const cart = db.cart;
const detailCartProduct = db.detailCartProduct;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.find = function(security,field,scope, result){
    let op = null;
    let conditionKey = new Object();
    let conditionProduct = new Object();
    let searchProduct = false;
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        if(key === "idProductVarian"){
            searchProduct = true;
            op = operator.eq;
            condition[op] = value;
            conditionProduct[columnDictionary(key)] = condition;        
        }else{
            op = operator.eq;
            condition[op] = value;
            conditionKey[columnDictionary(key)] = condition;            
        }
    }
    let currentDate = new Date();
    let detailCartProductModel = {
            model: detailCartProduct,
            as: 'products',
            attributes:{exclude:['id_product_varian']},
            include:{
                model: db.product_varian,
                as: 'varian',
                attributes:{exclude:['id','id_product','dateCreated','status','createdBy']},
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
                },{
                    model: db.product,
                    as: 'product',
                    attributes:{exclude:['dateCreated',
                            'status',
                            'createdBy',
                            'id_brand',
                            'id_category',
                            'created_by',
                            'id_sub_category',
                            'brandName',
                            'idSubCategory',
                            'description',
                            'idFurtherSubCategory'
                        ]}
                }
                ]
            }
        };
    if(searchProduct){
        detailCartProductModel.where=[conditionProduct];
    }
    let conditionObject = {
        where: [conditionKey]
    }
    let productOwnerWhereCondition = new Object();
    productOwnerWhereCondition[operator.and]=[
                    {status:'1'},
                    {store_address:'1'}
                ];
    if(scope!= "null" && scope == "all"){
        conditionObject.include=[{
            attributes:{
                exclude: ['username',
                    'password',
                    'email',
                    'phoneNumber',
                    'idCitizen',
                    'fullName',
                    'code',
                    'seller_star',
                    'customerStar',
                    'status',
                    'updatedAt',
                    'createdAt',
                    'lastLogin',
                    'photoAccount',
                    'gender',
                    'photoId',
                    'dob',
                    'serialNumber',
                    'id'
                ]
            },
            model: db.users,
            as: 'store',
            include:{
                attributes:{
                exclude: [
                        'id_district',
                        'id_city',
                        'id_province'
                    ]
                },
                model:db.tr_address,
                as:'addresses',
                where:productOwnerWhereCondition,
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
                ]
            }
        },
        detailCartProductModel]
        
    }
    conditionObject.attributes={
        exclude: ['id_store']
    }
    
    cart.findAll(conditionObject).then(data=>{
        if(data == null){
            result("Not Found", 404, null);
        }else{
            security.encrypt(data)
            .then(function(encryptedData){
                result("success", 200, encryptedData);
            }).catch(function(error){
                result(error, 500, null);
            });            
        }
    }).catch(err=>{
       result(err.message, 500, null);
    });
}

exports.create = function(newData,security, result){
    cart.create(newData,{
        include:[{
                association: cart.associations.products,
        }]
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            result(error,500,null);
        });        
    }).catch(err=>{
        result(err.message, 500, null);
    });
};
exports.createChild = function(newData,security, result){
    detailCartProduct.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            result(error,500,null);
        });        
    }).catch(err=>{
        result(err.message, 500, null);
    });
};
exports.delete = function (data, result){
    let condition = new Object();
    let conditionKey = new Object();
    condition[operator.eq] = data;
    conditionKey['id_cart_product'] = condition;
    detailCartProduct.destroy({
        where: [conditionKey]
    }).then(data=>{
        result("success", 200, data[0]);
    }).catch(err=>{
        result(err.message, 500, null);
    });
}
exports.update = function(newData, result){
     detailCartProduct.update(
        newData,
        {
            where: {id_cart_product: parseInt(newData.idCartProduct)}
        }).then(function(data){
        if(data[0] == 1){
            result("success", 200, data[0]);
        }else{
            result("no changes", 200, data[0]);
        }
    })
    .catch(err=>{
        result(err.message, 500, null);
    });
};
function columnDictionary(key){
    if(key === 'idUser'){
        return 'id_user';
    }else if(key === 'idProductVarian'){
        return 'id_product_varian';
    }else if(key === 'idStore'){
        return 'id_store';
    }else{
        return key;
    }
}