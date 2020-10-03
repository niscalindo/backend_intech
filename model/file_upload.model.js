/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const fileUpload = sequelize.define("tm_file_upload",{
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
            field: 'id_file'
        },
        idUser:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_use'
        },
        fileName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'file_name'
        },
        countData:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'count_data'
        },
        countSuccess:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'count_success'
        },
        downloaded:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0'
        }
    },{timestamps: false});
    return fileUpload;
}