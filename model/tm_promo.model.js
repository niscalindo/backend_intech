/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const promo = sequelize.define("tm_promo",{
        dateCreated:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date_created'
        },
        status:{
            type: Sequelize.ENUM('0','1','2'),
            defaultValue: '1'
        },
        createdBy:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'created_by'
        },
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_promo'
        },
        name:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'promo_name'
        },
        code:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'promo_code'
        },
        freeShipping:{
            type: Sequelize.ENUM('Y','N'),
            allowNull: false,
            defaultValue: 'N'
        },
        dateStarted:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date_started'
        },
        dateEnded:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date_ended'
        },
        source:{
            type: Sequelize.ENUM('admin','user'),
            defaultValue: 'user'
        }
    },{timestamps: false});
    return promo;
}