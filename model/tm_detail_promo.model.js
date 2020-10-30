/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const detail_promo = sequelize.define("tm_detail_promo",{
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
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_detail_promo'
        },
        idPromo:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id_promo'
        },
        idParticipant:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id_participant'
        },
        idProductVarian:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id_product_varian'
        },
        amount:{
            type: Sequelize.DECIMAL(10,2),
            field: 'amount',
            defaultValue: 0
        },
        amountUnit:{
            type: Sequelize.ENUM('percent','rupiah'),
            defaultValue: 'rupiah',
            field: 'amount_unit'
        },
        priceAfterDiscount:{
            type: Sequelize.DECIMAL(10,2),
            defaultValue: 0,
            field: 'price_after_discount'
        }
    },{timestamps: false});
    return detail_promo;
}