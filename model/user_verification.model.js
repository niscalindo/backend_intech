/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const userVerification = sequelize.define("verification_user",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },idUser:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_user'
        },
        codeConfirmation:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'code_confirmation'
        }
    },{timestamps: false});
    return userVerification;
}