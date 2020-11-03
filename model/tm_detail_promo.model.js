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
        discountInPercent:{
            type: Sequelize.DECIMAL(10,2),
            field: 'discount_in_percent',
            defaultValue: 0
        },
        discountInRupiah:{
            type: Sequelize.DECIMAL(10,2),
            defaultValue: 0,
            field: 'discount_in_rupiah'
        },
        purchaseLimit:{
            type: Sequelize.DECIMAL(10,2),
            defaultValue: 0,
            field: 'purchase_limit'
        }
    },{timestamps: false});
    return detail_promo;
}