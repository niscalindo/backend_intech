/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const trAddress = sequelize.define("tr_address",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_address'
        },
        createdBy:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_user'
        },
        address:{
            type: Sequelize.TEXT,
            allowNull: false,
            field: 'address'
        },
        idDistrict:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_district'
        },
        idCity:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_city'
        },
        idProvince:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_province'
        },
        postalCode:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'postal_code'
        },
        dateCreated: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'date_created'
        },
        recipientName:{
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'recipient_name'
        },
        phoneNumber: {
            type: Sequelize.STRING(100),
            allowNull: false,
            field: 'phone'
        },
        privateAddress:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            field: 'private_address'
        },
        storeAddress:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            field: 'store_address'
        },
        returnAddress:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            field: 'return_address'
        },
        status:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '1'
        }
    },{timestamps: false});
    return trAddress;
}