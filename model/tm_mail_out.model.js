/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const mail_out = sequelize.define("tm_mail_out",{
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
        id_email_out:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_email_out'
        },
        message:{
            type: Sequelize.TEXT,
            allowNull: true,
            field: 'message'
        },
        name:{
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'name'
        },
        email:{
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'email'
        },
        about:{
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'about'
        },
        customer:{
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'customer'
        },
        id_email_in:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_email_in'
        },
       
    },{timestamps: false});
    return mail_out;
}