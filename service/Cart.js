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
    for (let [key, value] of Object.entries(field)) {
        let condition = new Object();
        op = operator.eq;
        condition[op] = value;
        conditionKey[columnDictionary(key)] = condition;
    }
    
    let conditionObject = {
        where: [conditionKey]
    }
    let productOwnerWhereCondition = new Object();
    productOwnerWhereCondition[operator.and]=[
                    {status:'1'},
                    {store_address:'1'}
                ];
    let currentDate = new Date();
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
                    'serialNumber'
                ]
            },
            model: db.users,
            as: 'store',
            include:{
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
        {
            model: detailCartProduct,
            as: 'products',
            attributes:{exclude:['id_product_varian']},
            include:{
                model: db.product_varian,
                as: 'varian',
                attributes:{exclude:['id','id_product','dateCreated','status','createdBy']},
                include:{
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
                }
            }
        }]
        
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
function columnDictionary(key){
    if(key === 'idUser'){
        return 'id_user';
    }else if(key === 'idProductVarian'){
        return 'id_product_varian';
    }else{
        return key;
    }
}