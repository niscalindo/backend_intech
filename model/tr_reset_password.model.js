/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const resetPassword = sequelize.define("tr_reset_password",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idUser:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_user'
        },
        status:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '1'
        },
        informationCode:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'information_code'
        },
        timeLimit:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'time_limit'
        }
    },{timestamps: false});
    return resetPassword;
}
