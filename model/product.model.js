/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const product = sequelize.define("tm_product",{
        dateCreated:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date_created'
        },
        status:{
            type: Sequelize.ENUM('0','1','2'),
            allowNull: false,
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
            field: 'id_product'
        },
        name:{
            type: Sequelize.STRING(80),
            allowNull: false,
            field: 'product_name'
        },
        description:{
            type: Sequelize.TEXT,
            allowNull: false,
            field: 'description'
        },
        unit:{
            type: Sequelize.STRING(10),
            allowNull: false
        },
        idSubCategory:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_sub_category'
        },
        subCategoryName:{
            type: Sequelize.STRING(50),
            allowNull: false,
            field: 'sub_category_name'
        },
        idFurtherSubCategory:{
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'id_further_sub_category'
        },
        furtherSubCategoryName:{
            type: Sequelize.STRING(50),
            allowNull: true,
            field: 'further_sub_category_name'
        },
        defaultPicture:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'default_picture'
        },
        wholesaleMinBuy:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
            field: 'wholesale_min_buy'
        },
        wholesaleMaxBuy:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
            field: 'wholesale_max_buy'
        },
        wholesalePrice:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
            field: 'wholesale_price'
        },
        packetWeight:{
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'packet_weight'
        },
        packetWeightUnit:{
            type: Sequelize.STRING(10),
            allowNull: false,
            field: 'packet_weight_unit'
        },
        packetWide:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
            field: 'packet_wide'
        },
        packetLong:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
            field: 'packet_long'
        },
        packetTall:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
            field: 'packet_tall'
        },
        preorder:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            allowNull: true,
            field: 'preorder'
        },
        condition:{
            type: Sequelize.ENUM('new','preowned'),
            defaultValue: 'preowned',
            allowNull: true,
            field: 'condition'
        },
    },{timestamps: false});
    return product;
}