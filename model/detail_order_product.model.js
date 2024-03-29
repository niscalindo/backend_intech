/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = (sequelize, Sequelize)=>{
    const detailOrderProduct = sequelize.define("detail_order_product",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_order_product'
        },
        id_order_store:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_order_store'
        },
        idProductVarian:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'id_product_varian'
        },
        sku:{
            type: Sequelize.STRING(50),
            allowNull: true
        },
        productName:{
            type: Sequelize.STRING(250),
            allowNull: false,
            field: 'product_name'
        },
        productImage:{
            type: Sequelize.STRING(250),
            allowNull: false,
            field: 'product_image'
        },
        productPrice:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'product_price'
        },
        discountAmount:{
            type: Sequelize.INTEGER,
            field: 'discount_amount',
            default: 0
        },
        priceAfterDiscount:{
            type: Sequelize.INTEGER,
            field: 'price_after_discount',
            default: 0
        },
        quantity:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'quantity'
        },
        packetWeight:{
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'packet_weight'
        },
        reviewScore:{
            type: Sequelize.INTEGER,
            field: 'review_score'
        },
        review:{
            type: Sequelize.STRING(500),
            allowNull: true
        },
        reviewPictures:{
            type: Sequelize.STRING(500),
            allowNull: true,
            field: 'review_pictures'
        },
        reviewDate:{
            type: Sequelize.DATE,
            allowNull: true,
            field: 'review_date'
        },
        reviewResponDate:{
            type: Sequelize.DATE,
            allowNull: true,
            field: 'review_respon_date'
        },
        reviewRespon:{
            type: Sequelize.STRING(1000),
            allowNull: true,
            field: 'review_respon'
        },
        isReviewPrivate:{
            type: Sequelize.ENUM('0','1'),
            defaultValue: '0',
            field: 'is_review_private'
        },
        packetUnit:{
            type: Sequelize.STRING(20),
            allowNull: false,
            field: 'packet_unit'
        }
    },{timestamps: false});
    return detailOrderProduct;
}