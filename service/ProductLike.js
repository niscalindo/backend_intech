        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const productLike = db.product_like;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.find = function(security,order,findBy,id, result){
    let whereCondition = new Object();
    if(findBy == "user"){
        whereCondition["id_user"]={
            [operator.eq]:id
        }
    }else{
        whereCondition["id_product_varian"]={
            [operator.eq]:id
        }        
    }
    productLike.findAll({
        attributes:{
            exclude: ['createdBy', 'dateCreated']
        },
        where:whereCondition
        ,
        order: [
            ['id', order]
        ],
    }).then(data=>{
        
    }).catch(err=>{
       result(err.message, 500, null);
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
                result(err.message, 500, null);
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
                    result(error,500,null);
                });        
            }).catch(err=>{
                result(err.message, 500, null);
            });             
        }       
    }).catch(err=>{
       result(err.message, 500, null);
    });
};

exports.update= function(newData, result){
    brand.update(
        newData,
        {
            where: {id_brand: parseInt(newData.id)}
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
    if(key === 'id'){
        return 'id_brand';
    }else if(key === 'idParent'){
        return 'id_parent';
    }else if(key === 'groupBy'){
        return 'parent';
    }else if(key === 'name'){
        return 'brand_name';
    }else{
        return key;
    }
}