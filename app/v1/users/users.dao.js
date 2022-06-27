const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Users */
const UsersDAO = dbInstance.define('Users', {
    user_id: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        primaryKey: true,
        autoIncriment: true
    },
    user_uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user_role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
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
    tableName: 'users'
});


module.exports = UsersDAO;