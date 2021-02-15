/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const userPaymentAccount = sequelize.define("tm_user_payment_account",{
        dateCreated:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date_created'
        },
        status:{
            type: Sequelize.ENUM('0','1','2'),
            defaultValue: '1'
        },
        makeMain:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            field: 'make_main'
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
            field: 'id_account'
        },
        accountName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'account_name'
        },
        accountNumber:{
            type: Sequelize.STRING(45),
            allowNull: false,
            field: 'account_number'
        },
        accountBank:{
            type: Sequelize.STRING(20),
            allowNull: false,
            field: 'account_bank'
        },
        accountIcon:{
            type: Sequelize.STRING(20),
            allowNull: false,
            field: 'account_icon'
        },
        idUser:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_user'
        }
    },{timestamps: false});
    return userPaymentAccount;
}