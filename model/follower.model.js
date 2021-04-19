/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const follower = sequelize.define("follower",{
        dateCreated:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date_created'
        },
        status:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '1'
        },
        idUser:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_user'
        },
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        idStore:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_store'
        }
    },{timestamps: false});
    return follower;
}