const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const UsersDAO = require('../users/users.dao');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Stores */
const StoresDAO = dbInstance.define('Stores', {
    store_id: {
        type: DataTypes.INTEGER,
        field: 'store_id',
        primaryKey: true,
        autoIncriment: true
    },
    store_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'user_id',
        references: {
            model: UsersDAO,
            key: 'user_id'
        }
    },
    store_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    store_address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    store_shares: {
        type: DataTypes.STRING,
        allowNull: true
    },
    store_sales_progress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    store_availability: {
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
    tableName: 'store'
})


module.exports = StoresDAO;