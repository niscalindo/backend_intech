/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const furtherSubCategoryProduct = sequelize.define("tm_further_sub_category_product",{
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
            field: 'id_further_sub_category'
        },
        idSubCategory:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_sub_category'
        },
        subCategoryName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'sub_category_name'
        },
        categoryName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'category_name'
        },
        furtherSubCategoryCode:{
            type: Sequelize.STRING(20),
            allowNull: false,
            field: 'further_sub_category_code'
        },
        furtherSubCategoryName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'further_sub_category_name'
        },
        mutableBrand:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '1',
            field: 'mutable_brand'
        }
    },{timestamps: false});
    return furtherSubCategoryProduct;
}