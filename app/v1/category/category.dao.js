const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const BrandDAO = require('../brand/brand.dao');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Category */
const CategoryDAO = dbInstance.define('Category', {
    category_id: {
        type: DataTypes.INTEGER,
        field: 'category_id',
        primaryKey: true,
        autoIncriment: true
    },
    category_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    brand_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'brand_id',
        references: {
            model: BrandDAO,
            key: 'brand_id'
        }
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand_score: {
        type: DataTypes.STRING,
        allowNull: true
    },
    brand_osa: {
        type: DataTypes.STRING,
        allowNull: true
    },
    others: {
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
    tableName: 'category'
})

module.exports = CategoryDAO;