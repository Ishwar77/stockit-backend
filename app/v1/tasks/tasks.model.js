const logger = require('../../utils/logger');
const TasksDAO = require('./tasks.dao');
const MyConst = require('../utils');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');


module.exports = class TasksModel {
    constructor(
        task_id, task_uuid, store_id, task_name, task_description, assigned_to,
        status, created_at, updated_at, is_active = 1, comments
    ) {
        this.task_id = task_id; this.task_uuid = task_uuid; this.store_id = store_id;
        this.task_name = task_name; this.task_description = task_description;
        this.assigned_to = assigned_to; this.status = status; this.comments = comments;
        this.created_at = created_at; this.updated_at = updated_at; this.is_active = is_active;
    }

    /**
* To insert into DB
* @param obj TasksModel 
*/
    static async createTasks(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + TasksModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.store_id)) + " " + (JSON.stringify(obj.task_name)) + " " + new Date();
        let task_gen_uuid = Cryptic.hash(data);
        const tasksData = {
            task_uuid: task_gen_uuid,
            store_id: obj.store_id,
            task_name: obj.task_name,
            task_description: obj.task_description,
            assigned_to: obj.assigned_to,
            comments: obj.comments,
            status: obj.status
        }
        try {
            return await TasksDAO.create(tasksData);
        } catch (e) {
            logger.error('Unable to Create the Tasks');
            logger.error(e);
        }
        if (created) {
            return await TasksModel.getTaskById(created['null'])
        }
        return created;
    }

    /**
* Utility function to get all Tasks
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getTasks() {
        return await TasksDAO.findAll({
            where: {
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
    * Utility function to get by Tasks Id
    * @param task_id
    * @returns any
    */
    static async getTaskById(taskId = 0) {
        return await TasksDAO.findAll({
            where: {
                task_id: taskId,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
* Utility function to update by Tasks Id
* @param task_id
* @params obj
* @returns any
*/
    static async updateTasksById(taskId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', taskId, obj);
        try {
            updated = await TasksDAO.update(obj, {
                where: {
                    task_id: taskId,
                    is_active: true
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the Task');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return TasksModel.getTaskById(taskId);
        } else {
            return null;
        }
    }


    /**
* Utility function to delete by Tasks Id
* @param task_id
* @returns any
*/
    static async deleteTasksById(taskId = 0, fource = false) {
        if (!fource) {
            const del = await TasksModel.updateTasksById(taskId, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await TasksModel.destroy({
            where: {
                task_id: taskId
            }
        });
    }

    //Operations on UUID
    static async getTasksByUUId(uuid = 0) {
        return await TasksDAO.findAll({
            where: {
                task_uuid: uuid,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updateTasksByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await TasksDAO.update(obj, {
                where: {
                    task_uuid: uuid,
                    is_active: true
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the Task');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return await TasksModel.getTasksByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteTasksByUUId(uuid = 0, force = false) {
        if (!force) {
            const del = await TasksModel.updateTasksByUUId(uuid, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await TasksModel.destroy({
            where: {
                task_uuid: uuid
            }
        });
    }
}