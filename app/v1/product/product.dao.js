const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const CategoryDAO = require('../category/category.dao');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Product */
const ProductDAO = dbInstance.define('Products', {
    product_id: {
        type: DataTypes.INTEGER,
        field: 'product_id',
        primaryKey: true,
        autoIncriment: true
    },
    product_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'category_id',
        references: {
            model: CategoryDAO,
            key: 'category_id'
        }
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    product_availability: {
        type: DataTypes.STRING,
        allowNull: true
    },
    product_brand_share: {
        type: DataTypes.STRING,
        allowNull: true
    },
    product_consumer_interest: {
        type: DataTypes.STRING,
        allowNull: true
    },
    product_reason_for_unavailability: {
        type: DataTypes.STRING,
        allowNull: true
    },
    product_osa_percentage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    product_rcl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    product_opportunity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    product_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    barcode_number:{
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
        defaultValue: DataTypes.NOW
    },
    is_active: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
}, {
    timestamps: false,
    tableName: 'products'
})


module.exports = ProductDAO;