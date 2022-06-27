const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const StoresDAO = require('../stores/stores.dao');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Brand */
const BrandDAO = dbInstance.define('Brands', {
    brand_id: {
        type: DataTypes.INTEGER,
        field: 'brand_id',
        primaryKey: true,
        autoIncriment: true
    },
    brand_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    store_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'store_id',
        references: {
            model: StoresDAO,
            key: 'store_id'
        }
    },
    brand_name: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: 'brand'
})


module.exports = BrandDAO;