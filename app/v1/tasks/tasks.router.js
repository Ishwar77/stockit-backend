const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const TasksModel = require('./tasks.model');
const TasksUtil = require('./tasks.util');
const MyConst = require('../utils');

console.log("TASKS Router Loaded !");

router.get('/', async (req, res) => {
    const tasks = await TasksModel.getTasks()
    ApiResponse.sendResponse(res, 200, "Getting all Tasks", tasks);
});

router.get('/:id', async (req, res) => {
    const taskId = parseInt(req.params.id) || 0;
    const tasks = await TasksModel.getTaskById(taskId)
    ApiResponse.sendResponse(res, 200, "Getting Tasks on ID", tasks);
});

router.post('/', async (req, res) => {
    const err = TasksUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const tasks = await TasksModel.createTasks(req.body);
    ApiResponse.sendResponse(res, tasks ? 200 : 400, tasks ? "Creation Success" : "Creation Failed", tasks);
});

router.put('/:id', async (req, res) => {
    const taskId = parseInt(req.params.id) || 0;
    if (!taskId) {
        const msg = "Task: PUT Id = " + taskId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Task Id seems invalid", msg);
        return;
    }
    const err = TasksUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    //console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const tasks = await TasksModel.updateTasksById(taskId, req.body);
    ApiResponse.sendResponse(res, tasks ? 200 : 400, tasks ? "Update Success" : "Update Failed", { status: tasks });
});

router.delete('/:id', async (req, res) => {
    const taskId = parseInt(req.params.id) || 0;
    if (!taskId) {
        const msg = "Task: PUT Id = " + taskId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Task ID seems invalid", msg);
        return;
    }
    const tasks = await TasksModel.deleteTasksById(taskId);
    // console.log(tasks);
    ApiResponse.sendResponse(res, tasks === 1 ? 200 : 400, tasks === 1 ? "Delete Success" : "Deletion Failed", { status: tasks });
});

//UUID operations
router.get('/uuid/:id', async (req, res) => {
    const tasks = await TasksModel.getTasksByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Tasks", tasks);
});

router.put('/updateonuuid/:id', async (req, res) => {
    const err = TasksUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const tasks = await TasksModel.updateTasksByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, tasks ? 200 : 400, tasks ? "Update Success" : "Update Failed", { status: tasks });
});

router.delete('/deleteonuuid/:id', async (req, res) => {
    const tasks = await TasksModel.deleteTasksByUUId(req.params.id);
    ApiResponse.sendResponse(res, tasks === 1 ? 200 : 400, tasks === 1 ? "Delete Success" : "Deletion Failed", { status: tasks });
});

module.exports = router;