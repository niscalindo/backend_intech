/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const categoryProduct = sequelize.define("tm_category_product",{
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
            field: 'id_category'
        },
        categoryName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'category_name'
        },
        icon:{
            type: Sequelize.STRING(45),
            allowNull: true,
            defaultValue: null
        },
        categoryCode:{
            type: Sequelize.STRING(20),
            allowNull: false,
            field: 'category_code'
        }
    },{timestamps: false});
    return categoryProduct;
}