/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const delivery = sequelize.define("tm_delivery",{
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
            field: 'id_delivery'
        },
        idCourier:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_courier'
        },
        deliveryName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'delivery_name'
        },
        deliveryPrice:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'delivery_price'
        },
        checkedStatus:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '1',
            field: 'checked_status'
        }
    },{timestamps: false});
    return delivery;
}