/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const slider = sequelize.define("tm_slider",{
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
            field: 'id_slider'
        },
        name:{
            type: Sequelize.STRING(100),
            allowNull: true
        },
        fileName:{
            type: Sequelize.STRING(100),
            allowNull: true,
            field: 'name_file'
        }
    },{timestamps: false});
    return slider;
}