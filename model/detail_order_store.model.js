/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const detailOrderStore = sequelize.define("detail_order_store",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_order_store'
        },
        idStore:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_store'
        },
        id_order:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_order'
        },
        storeName:{
            type: Sequelize.STRING(250),
            allowNull: false,
            field: 'store_name'
        },
        storeImage:{
            type: Sequelize.STRING(300),
            allowNull: false,
            field: 'store_image'
        },
        storeAddress:{
            type: Sequelize.STRING(250),
            allowNull: false,
            field: 'store_address'
        },
        deliveryName:{
            type: Sequelize.STRING(250),
            allowNull: false,
            field: 'delivery_name'
        },
        deliveryBasePrice:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'delivery_base_price'
        },
        deliveryPrice:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'delivery_price'
        },
        note:{
            type: Sequelize.STRING(1000),
            allowNull: true,
            field: 'note'
        },
        isPaid:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            field: 'is_paid'
        },
        paidDate:{
            type: Sequelize.DATE,
            allowNull: true,
            field: 'paid_date',
            defaultValue:null
        },
        isPacked:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            field: 'is_packed'
        },
        packedDate:{
            type: Sequelize.DATE,
            allowNull: true,
            field: 'packed_date',
            defaultValue:null
        },
        isDelivered:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            field: 'is_delivered'
        },
        deliveredDate:{
            type: Sequelize.DATE,
            allowNull: true,
            field: 'delivered_date',
            defaultValue:null
        },
        isFinish:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            field: 'is_finish'
        },
        finishDate:{
            type: Sequelize.DATE,
            allowNull: true,
            field: 'finish_date',
            defaultValue:null
        },
        receivedBy:{
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'received_by'
        },
        canceledDate:{
            type: Sequelize.DATE,
            allowNull: true,
            field: 'canceled_date'
        },
        resi:{
            type: Sequelize.STRING(100),
            allowNull: true
        },
        cancelReason:{
            type: Sequelize.STRING(500),
            allowNull: true,
            field: 'cancel_reason'
        },
        cancelBy:{
            type: Sequelize.ENUM('buyer','seller'),
            allowNull: true,
            field: 'canceled_by'
        },
        status:{
            type: Sequelize.ENUM('0','1','2'),
            defaultValue: '1'
        }
    },{timestamps: false});
    return detailOrderStore;
}