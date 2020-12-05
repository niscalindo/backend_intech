/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const mail_in = sequelize.define("tm_mail_in",{
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
        id_email_in:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_email_in'
        },
        message:{
            type: Sequelize.TEXT,
            allowNull: false,
            field: 'message'
        },
        email:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'email'
        },
        name:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'name'
        },
        about:{
            type: Sequelize.STRING(200),
            allowNull: false,
            field: 'about'
        },
        reply:{
            type: Sequelize.ENUM('0','1','2'),
            defaultValue: '0'
        },
       
    },{timestamps: false});
    return mail_in;
}