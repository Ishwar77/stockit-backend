const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const StoresModel = require('./stores.model');
const StoresUtil = require('./stores.util');
const MyConst = require('../utils');

console.log("STORES Router Loaded !");

router.get('/', async (req, res) => {
    const stores = await StoresModel.getStores()
    ApiResponse.sendResponse(res, 200, "Getting all Store", stores);
});

router.get('/:id', async (req, res) => {
    const storeId = parseInt(req.params.id) || 0;
    const stores = await StoresModel.getStoreById(storeId)
    ApiResponse.sendResponse(res, 200, "Getting Store on ID", stores);
});

router.post('/', async (req, res) => {
    const err = StoresUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const stores = await StoresModel.createStores(req.body);
    ApiResponse.sendResponse(res, stores ? 200 : 400, stores ? "Creation Success" : "Creation Failed", stores);
});

router.put('/:id', async (req, res) => {
    const storeId = parseInt(req.params.id) || 0;
    if (!storeId) {
        const msg = "Store: PUT Id = " + storeId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Store Id seems invalid", msg);
        return;
    }
    const err = StoresUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    //console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const stores = await StoresModel.updateStoresById(storeId, req.body);
    ApiResponse.sendResponse(res, stores ? 200 : 400, stores ? "Update Success" : "Update Failed", { status: stores });
});


router.delete('/:id', async (req, res) => {
    const storeId = parseInt(req.params.id) || 0;
    if (!storeId) {
        const msg = "Store: PUT Id = " + storeId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Store ID seems invalid", msg);
        return;
    }
    const stores = await StoresModel.deleteStoreById(storeId);
    // console.log(stores);
    ApiResponse.sendResponse(res, stores === 1 ? 200 : 400, stores === 1 ? "Delete Success" : "Deletion Failed", { status: stores });
});

//UUID operations
router.get('/uuid/:id', async (req, res) => {
    const stores = await StoresModel.getStoresByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Stores", stores);
});


router.put('/updateonuuid/:id', async (req, res) => {
    const err = StoresUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const stores = await StoresModel.updateStoresByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, stores ? 200 : 400, stores ? "Update Success" : "Update Failed", { status: stores });
});


router.delete('/deleteonuuid/:id', async (req, res) => {
    const stores = await StoresModel.deleteStoreByUUId(req.params.id);
    ApiResponse.sendResponse(res, stores === 1 ? 200 : 400, stores === 1 ? "Delete Success" : "Deletion Failed", { status: stores });
});

module.exports = router;