/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const viewer = sequelize.define("tm_product_viewed",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dateCreated:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'date_created'
        },
        idViewer:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_viewer'
        },
        idProduct:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_product_varian'
        }
    },{timestamps: false});
    return viewer;
}