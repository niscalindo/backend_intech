/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const pictures = sequelize.define("tm_product_picture",{
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
            field: 'id_picture'
        },
        filename:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'filename'
        },
        id_product:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_product'
        }
    },{timestamps: false});
    return pictures;
}