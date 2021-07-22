/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const detailCartProduct = sequelize.define("detail_cart_product",{
        idCartProduct:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_cart_product'
        },id_cart:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_cart'
        },
        idProductVarian:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_product_varian'
        },
        qty:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },{timestamps: false});
    return detailCartProduct;
}