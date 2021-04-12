        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const chat = db.chat;
const detailChat = db.detail_chat;
const productVarian = db.product_varian;
const product= db.product;
const users = db.users;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.getAll = function(security,order,userRole, idUser, result){
    let condition = new Object();
    condition['status']={
        [operator.eq]: '1'
    }
    if(userRole === "user"){
        condition['created_by']={
            [operator.eq]: idUser
        }
    }else{
        condition['destination_id']={
            [operator.eq]: idUser
        }
    }
    chat.findAll({
        attributes:{
            exclude: ['createdBy', 'dateCreated']
        },
        where: condition,
        include:[
            {
                model: users,
                as: 'destination',
                required: true
            },
            {
                model: detailChat,
                as: 'histories',
                where:{
                  status:{
                      [operator.ne]: '2'
                  }  
                },
                include:[
                    {
                        model: productVarian,
                        as: 'varian',
                        include:[
                            {
                                model: db.detail_promo,
                                as: 'detailPromo',
                                required: false
                            },
                            {
                                model: product,
                                as: 'product',
                                required: true
                            }
                        ],
                        required: false
                    }
                ],
                order: [
                    ['id', order]
                ],
                required: false
            }
        ],
        order: [
            ['id', order]
        ],
    }).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            result(error, 500, null);
        });
    }).catch(err=>{
       result(err.message, 500, null);
    });
};

exports.create = function(newData,security, result){
    newData['status'] = '0';  
    newData['dateCreated'] = new Date();   
    if(newData['idChat'] == "" || newData['idChat'] == null){
        chat.findAll({
            attributes:{
                exclude: ['createdBy','dateCreated']
            },
            where:{
                destination_id:newData['destinationId']
            },
        }).then(data=>{
//            console.log('data : '+data.length);
            if(data.length == 0){
                chatData = new Object();
                chatData['status'] = '1';
                chatData['dateCreated'] = newData['dateCreated'];
                chatData['createdBy'] = newData['createdBy'];
                chatData['destinationId'] = newData['destinationId'];
                chat.create(chatData).then(data=>{
                    let newInsertedId = data.dataValues.id;
                    newData['idChat'] = newInsertedId;
                    detailChat.create(newData).then(data=>{
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
                }).catch(function(error){
                    result(error,500,null);
                });
            }else{
//                console.log('data haha : '+data[0].id);
                delete newData['destinationId'];
                newData['idChat'] = data[0].id;
                detailChat.create(newData).then(data=>{
                    security.encrypt(data)
                    .then(function(encryptedData){
                        let newInsertedId = encryptedData.dataValues.id;
                        let newData = new Object();
                        newData['id'] = newInsertedId;
                        result("success",201,newData);        
                    }).catch(err=>{
                        result(err.message, 500, null);
                    });
                }).catch(err=>{
                    result(err.message, 500, null);
                });
            }
        }).catch(err=>{
           console.log(err);
           result(err.message, 500, null);
        });
    }else{
        delete newData['destinationId'];
        detailChat.create(newData).then(data=>{
            security.encrypt(data)
            .then(function(encryptedData){
                let newInsertedId = encryptedData.dataValues.id;
                let newData = new Object();
                newData['id'] = newInsertedId;
                result("success",201,newData);        
            }).catch(err=>{
                result(err.message, 500, null);
            });
        }).catch(err=>{
            result(err.message, 500, null);
        });
    }
};

//exports.update= function(newData, result){
//    brand.update(
//        newData,
//        {
//            where: {id_brand: parseInt(newData.id)}
//        }).then(function(data){
//        if(data[0] == 1){
//            result("success", 200, data[0]);
//        }else{
//            result("no changes", 200, data[0]);
//        }
//    })
//    .catch(err=>{
//        result(err.message, 500, null);
//    });
//};
//exports.findMaxNumerator= function( result){
//    brand.findOne({
//        attributes:[
//            [sequelize.fn('max', sequelize.col('id_brand')), 'numerator']
//        ],
//        order: [
//            ['id_brand', 'desc']
//        ]
//    }).then(data=>{
//        result("success", 200, data);
//    }).catch(err=>{
//        result(err.message, 500, null);
//    });
//};
function columnDictionary(key){
    if(key === 'idChat'){
        return 'id_chat';
    }else{
        return key;
    }
}