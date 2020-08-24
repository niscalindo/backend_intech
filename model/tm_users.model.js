/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const tmUsers = sequelize.define("tm_user",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'USER_ID'
        },
        username:{
            type: Sequelize.STRING(20),
            allowNull: false,
            field: 'USER_NAME'
        },
        password: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'USER_PASSWORD'
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'USER_MAIL'
        },
        phone: {
            type: Sequelize.STRING(40),
            allowNull: true,
            field: 'USER_MOBILE'
        },
        fullName: {
            type: Sequelize.STRING(45),
            allowNull: false,
            field: 'USER_ALL_NAME'
        },
        privilege: {
            type: Sequelize.TINYINT(1),
            allowNull: false,
            field: 'USER_STATUS'
        },
        status:{
            type: Sequelize.TINYINT(1),
            allowNull: false,
            field: 'USER_STATUS'
        },
        isDeleted:{
            type: Sequelize.TINYINT(1),
            allowNull: false,
            field: 'IS_DELETED'
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true
        },
        last_login: {
            type: Sequelize.DATE,
            allowNull: true
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false
        }
    },{timestamps: false});
    return tmUsers;
}

