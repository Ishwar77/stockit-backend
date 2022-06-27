const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const StoresDAO = require('../stores/stores.dao');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Tasks */
const TasksDAO = dbInstance.define('Tasks', {
    task_id: {
        type: DataTypes.INTEGER,
        field: 'task_id',
        primaryKey: true,
        autoIncriment: true
    },
    task_uuid: {
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
    task_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    task_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assigned_to: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    comments: {
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
    tableName: 'tasks'
})


module.exports = TasksDAO;