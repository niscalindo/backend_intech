/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const bankAccount = sequelize.define("tm_bank_account",{
        dateCreated:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date_created'
        },
        status:{
            type: Sequelize.ENUM('0','1'),
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
            field: 'id_account'
        },
        bankName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'bank_name'
        },
        bankAccountName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'bank_account_name'
        },
        bankAccountName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'bank_account_name'
        },
        bankAccountNumber:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'bank_account_number'
        }
    },{timestamps: false});
    return bankAccount;
}