/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const chatDetail = sequelize.define("tm_detail_chat",{
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
            autoIncrement: true
        },
        idChat:{
            type: Sequelize.INTEGER,
            field: 'id_chat'
        },
        context:{
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        message:{
            type: Sequelize.STRING(150),
            allowNull: true,
        }
    },{timestamps: false});
    return chatDetail;
}