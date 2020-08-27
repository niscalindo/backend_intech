/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const captcha= sequelize.define("captcha",{
        dateCreated:{
            type: Sequelize.DATE,
            allowNull: false,
            field : 'date_created'
        },
        ipAddress:{
            type: Sequelize.STRING(45),
            allowNull: false,
            field: 'ip_address'
        },
        key:{
            type: Sequelize.STRING(20),
            allowNull: false
        },
        time:{
            type: Sequelize.STRING(45),
            allowNull: false
        }
    },{timestamps: false});
    captcha.removeAttribute('id');
    return captcha;
}