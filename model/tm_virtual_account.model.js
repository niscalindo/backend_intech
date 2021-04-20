/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const virtualAccount = sequelize.define("tm_virtual_account",{
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
            field: 'id_va'
        },
        vaName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'va_name'
        },
        vaCode:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'code'
        }
    },{timestamps: false});
    return virtualAccount;
}