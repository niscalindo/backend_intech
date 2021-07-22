/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const cart = sequelize.define("cart",{
        idUser:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_user'
        },
        idStore:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_store'
        },
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },{timestamps: false});
    return cart;
}