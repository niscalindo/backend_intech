/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const productLike = sequelize.define("product_like",{
        dateCreated:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date_created'
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
            field: 'id'
        },
        idProductVarian:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_product_varian'
        }
    },{timestamps: false});
    return productLike;
}