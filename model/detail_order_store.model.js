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
        }
    },{timestamps: false});
    return detailOrderStore;
}