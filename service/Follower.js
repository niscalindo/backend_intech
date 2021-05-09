        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const follower = db.follower;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;

exports.find = function(security,findBy,id,scope, result){
    let whereCondition = new Object();
    let condition = new Object();
    if(findBy == "follower"){
        condition[operator.eq] = id;
        whereCondition["id_store"]=condition
    }else{
        condition[operator.eq] = id;
        whereCondition["id_user"]=condition;
    }
    let conditionStatus = new Object();
    conditionStatus[operator.eq]='1';
    whereCondition['status']=conditionStatus;
    let conditionObject = {
        attributes:{
            exclude: ['dateCreated','id_user','id_store']
        },
        where:[whereCondition]
    }
    
    if(scope!="null" && scope == "all"){
        conditionObject.include={
            model:db.users,
            as:'storesFollowed',
            include:[{
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
                },
                {
                    model:db.product,
                    as:'products',
                    limit: 6
                }]
        }
    }
    follower.findAll(conditionObject).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            result("success", 200, encryptedData);
        }).catch(function(error){
            result(error, 500, null);
        });
    }).catch(err=>{
        console.log(err);
       result(err.message, 500, null);
    });
};

exports.create = function(newData,security, result){
    follower.count({
        attributes:{
            exclude: ['dateCreated']
        },
        where: {
                id_user:{
                    [operator.eq]:newData.idUser
                },
                id_store:{
                    [operator.eq]:newData.idStore
                },
                status:{
                    [operator.eq]:'1'
                }
            }
    }).then(data=>{
        if(data > 0){
            let updateData = new Object();
            updateData.idUser = newData.idUser;
            updateData.idStore = newData.idStore;
            updateData.dateCreated = new Date();
            updateData.status =  '0';
            follower.update(updateData,{
                where: {
                        id_user:{
                            [operator.eq]:newData.idUser
                        },
                        id_store:{
                            [operator.eq]:newData.idStore
                        }
                    }
            }).then(data=>{
                result("success",201,data);
            }).catch(err=>{
                result(err.message, 500, null);
            });
        }else{
            newData['dateCreated'] = new Date();   
            follower.create(newData).then(data=>{
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