/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const regency = sequelize.define("regencies",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        idProvince:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'province_id'
        },
        name:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'name'
        }
    },{timestamps: false});
    return regency;
}