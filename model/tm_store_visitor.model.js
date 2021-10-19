/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const visitor = sequelize.define("tm_store_visitor",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_visit'
        },
        visitDate:{
            type: Sequelize.DATE,
            allowNull: false,
            field: 'visit_date'
        },
        idVisitor:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_visitor'
        },
        idStore:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_store'
        }
    },{timestamps: false});
    return visitor;
}