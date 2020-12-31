/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const district = sequelize.define("districts",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        idRegency:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'regency_id'
        },
        name:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'name'
        }
    },{timestamps: false});
    return district;
}