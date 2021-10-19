        /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const db = require("../model");
const visitor = db.tm_store_visitor;
const operator = db.Sequelize.Op;
const sequelize = db.sequelize;
const log = require('../utils/logger');

exports.countVisitor = function(idStore, result){
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth()+1;
    let currentYear = currentDate.getFullYear();
    
    visitor.count({
        where: [{
            id_store:{
                [operator.eq]: idStore
            }
        },
        {
            [operator.and]:[sequelize.where(sequelize.fn("month", sequelize.col("visit_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("visit_date")), currentYear)]
        }]
    }).then(data=>{
        let objectResponse = new Object();
        objectResponse.currentVisit = data;
        currentMonth = currentDate.getMonth();
        currentYear = currentDate.getFullYear();
        if(currentMonth == 0){
            currentMonth = 12;
            currentYear = currentYear-1;
        }
        visitor.count({
        where: [{
                id_store:{
                    [operator.eq]: idStore
                }
            },
        {
            [operator.and]:[sequelize.where(sequelize.fn("month", sequelize.col("visit_date")), currentMonth), sequelize.where(sequelize.fn("year", sequelize.col("visit_date")), currentYear)]
        }]
        }).then(data=>{
            objectResponse.lastMonthVisit = data;     
            result("Success", 200, objectResponse);       
        }).catch(err=>{
            log.visitor.error(err);
            result("Internal Server Error", 500, null);
        });
    }).catch(err=>{
        log.visitor.error(err);
        result("Internal Server Error", 500, null);
    });
};

exports.create = function(newData,security, result){
    newData['visitDate'] = new Date();   
    visitor.create(newData).then(data=>{
        security.encrypt(data)
        .then(function(encryptedData){
            let newInsertedId = encryptedData.dataValues.id;
            let newData = new Object();
            newData['id'] = newInsertedId;
            result("success",201,newData);
        }).catch(function(error){
            log.visitor.error(error);
            result("Encryption Failed", 1000, null);
        });        
    }).catch(err=>{
        log.visitor.error(err);
        result("Internal Server Error", 500, null);
    });
};