/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const brand = sequelize.define("tm_brand",{
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
            field: 'id_brand'
        },
        name:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'brand_name'
        },
        code:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'brand_code'
        },
        parentName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'parent_name'
        },
        idParent:{
            type: Sequelize.INTEGER,
            field: 'id_parent'
        },
        parent:{
            type: Sequelize.ENUM('subCategory','furtherSubCategory'),
            defaultValue: 'subCategory'
        }
    },{timestamps: false});
    return brand;
}