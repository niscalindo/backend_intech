/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const users = sequelize.define("users",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_user'
        },
        username:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'username'
        },
        password: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'password'
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: 'email'
        },
        phoneNumber: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'phone_number'
        },
        fullName: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: 'full_name'
        },
        idCitizen: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'id_citizen'
        },
        code: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'user_code'
        },
        storeName: {
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'store_name'
        },
        seller_star: {
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'seller_star'
        },
        customerStar: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'customer_star'
        },
        status:{
            type: Sequelize.ENUM('0','1','2'),
            defaultValue: '0'
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'updated_at'
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'created_at'
        },
        lastLogin: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'last_login'
        },
        serialNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            field: 'serial_number'
        },
        photoAccount: {
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'photo_account'
        },
        photoStore: {
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'photo_store'
        },
        gender: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
        photoId: {
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'photo_id_card'
        },
        storeDescription: {
            type: Sequelize.TEXT,
            allowNull: false,
            field: 'store_description'
        }
        
    },{timestamps: false});
    return users;
}

