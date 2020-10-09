/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const productVarian = sequelize.define("tm_product_varian",{
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
            field: 'id_product_varian'
        },
        id_product:{
            type: Sequelize.INTEGER,
            allowNull: false,            
            field: 'id_product'
        },
        optionName:{
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'option_name',
            defaultValue: null
        },
        sku:{
            type: Sequelize.STRING(45),
            allowNull: true,
            field: 'sku',
            defaultValue: null
        },
        varianName:{
            type: Sequelize.STRING(20),
            allowNull: true,
            field: 'varian_name',
            defaultValue: null
        },
        price:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'price'
        },
        stock:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'stock'
        }
    },{timestamps: false});
    return productVarian;
}