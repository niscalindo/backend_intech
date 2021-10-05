/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const order = sequelize.define("order",{
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
        totalInvoice:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'total_invoice'
        },
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_order'
        },
        invoice:{
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        paymentType:{
            type: Sequelize.ENUM('manual','virtual'),
            allowNull: false,
            field: 'payment_type',
            defaultValue: 'manual'
        },
        paymentBankName:{
            type: Sequelize.STRING(30),
            allowNull: false,
            field: 'payment_bank_name'
        },
        paymentBankIcon:{
            type: Sequelize.STRING(30),
            allowNull: true,
            field: 'payment_bank_icon'
        },
        paymentBankNumber:{
            type: Sequelize.STRING(30),
            allowNull: false,
            field: 'payment_bank_number'
        },
        paymentTimeLimit:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'payment_time_limit'
        },
        deliveryMaxDate:{
            type: Sequelize.DATE,
            allowNull: true,
            field: 'delivery_max_date'
        },
        buyerAddress:{
            type: Sequelize.STRING(30),
            allowNull: false,
            field: 'buyer_address'
        },
        receiverName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'receiver_name'
        },
        receiverPhoneNumber:{
            type: Sequelize.STRING(30),
            allowNull: false,
            field: 'receiver_phone_number'
        }
    },{timestamps: false});
    return order;
}