const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const UsersModel = require('./users.model');
const UsersUtil = require('./users.util');
const MyConst = require('../utils');
const reqIp = require("request-ip");
const InitModel = require('../../utils/jwt/init.model');

console.log("USERS Router Loaded !")

router.get('/', async (req, res) => {
    // const from = parseInt(req.query.from) || 0;
    // const limit = parseInt(req.query.limit) || 10;
    // const users = await UsersModel.getUsers(from, limit)
    const users = await UsersModel.getUsers()
    ApiResponse.sendResponse(res, 200, "Getting all Users", users);
});


router.get('/:id', async (req, res) => {
    const userId = parseInt(req.params.id) || 0;
    const users = await UsersModel.getUserById(userId)
    ApiResponse.sendResponse(res, 200, "Getting User", users);
});


router.post('/', async (req, res) => {
    const err = UsersUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const users = await UsersModel.createUsers(req.body);
    // console.log("users ", users.is_active);
    ApiResponse.sendResponse(res, users.is_active ? 200 : 400, users.is_active ? "Creation Success" : "Creation Failed", users);
});


router.put('/:id', async (req, res) => {
    const userId = parseInt(req.params.id) || 0;
    if (!userId) {
        const msg = "User: PUT Id = " + userId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "User Id seems invalid", msg);
        return;
    }
    const err = UsersUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    //console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const users = await UsersModel.updateUsersById(userId, req.body);
    ApiResponse.sendResponse(res, users ? 200 : 400, users ? "Update Success" : "Update Failed", { status: users });
});


router.delete('/:id', async (req, res) => {
    const userId = parseInt(req.params.id) || 0;
    if (!userId) {
        const msg = "User: PUT Id = " + userId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "UserId seems invalid", msg);
        return;
    }
    const users = await UsersModel.deleteUserById(userId);
    // console.log(users);
    ApiResponse.sendResponse(res, users === 1 ? 200 : 400, users === 1 ? "Delete Success" : "Deletion Failed", { status: users });
});


//UUID operations
router.get('/uuid/:id', async (req, res) => {
    const users = await UsersModel.getUsersByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Users", users);
});


router.put('/updateonuuid/:id', async (req, res) => {
    const err = UsersUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const users = await UsersModel.updateUsersByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, users ? 200 : 400, users ? "Update Success" : "Update Failed", { status: users });
});


router.delete('/deleteonuuid/:id', async (req, res) => {
    const users = await UsersModel.deleteUserByUUId(req.params.id);
    ApiResponse.sendResponse(res, users === 1 ? 200 : 400, users === 1 ? "Delete Success" : "Deletion Failed", { status: users });
});


router.post('/login', async (req, res) => {
    const users = await UsersModel.loginUsers(req.body);
    console.log("users ", req.body, req.body.user_role);
    if (users) {
        const ip = reqIp.getClientIp(req);
        const clientSignature = req.body['clientSignature'] || {};
        const roleUser = req.body.user_role || "USER";
        clientSignature['IP'] = clientSignature['IP'] ? clientSignature['IP'] : ip;
        const events = await InitModel.initSession(roleUser, clientSignature);
        if (events && events.state === 'ERROR') {
            ApiResponse.sendResponse(res, 400, "Creating User Session Failed", events);
        } else {
            ApiResponse.sendResponse(res, 200, "Creating User Session Success", events);
        }
    } else {
        ApiResponse.sendResponse(res, 400, "Login Failed Please enter Valid Credentials");
    }
});

module.exports = router;