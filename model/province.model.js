/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const province = sequelize.define("provinces",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        name:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'name'
        }
    },{timestamps: false});
    return province;
}