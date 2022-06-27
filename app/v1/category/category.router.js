const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const CategoryModel = require('./category.model');
const CategoryUtil = require('./category.util');
const MyConst = require('../utils');

console.log("CATEGORY Router Loaded !");

router.get('/', async (req, res) => {
    const categories = await CategoryModel.getCategories()
    ApiResponse.sendResponse(res, 200, "Getting all Categories", categories);
});

router.get('/:id', async (req, res) => {
    const categoryId = parseInt(req.params.id) || 0;
    const categories = await CategoryModel.getCategoryById(categoryId)
    ApiResponse.sendResponse(res, 200, "Getting Category on ID", categories);
});

router.post('/', async (req, res) => {
    const err = CategoryUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const categories = await CategoryModel.createCategory(req.body);
    ApiResponse.sendResponse(res, categories ? 200 : 400, categories ? "Creation Success" : "Creation Failed", categories);
});

router.put('/:id', async (req, res) => {
    const categoryId = parseInt(req.params.id) || 0;
    if (!categoryId) {
        const msg = "Category: PUT Id = " + categoryId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Category Id seems invalid", msg);
        return;
    }
    const err = CategoryUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    //console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const categories = await CategoryModel.updateCategoryById(categoryId, req.body);
    ApiResponse.sendResponse(res, categories ? 200 : 400, categories ? "Update Success" : "Update Failed", { status: categories });
});

router.delete('/:id', async (req, res) => {
    const categoryId = parseInt(req.params.id) || 0;
    if (!categoryId) {
        const msg = "Category: PUT Id = " + categoryId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Category ID seems invalid", msg);
        return;
    }
    const categories = await CategoryModel.deleteCategoryById(categoryId);
    // console.log(categories);
    ApiResponse.sendResponse(res, categories === 1 ? 200 : 400, categories === 1 ? "Delete Success" : "Deletion Failed", { status: categories });
});

//UUID operations
router.get('/uuid/:id', async (req, res) => {
    const categories = await CategoryModel.getCategoryByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Category", categories);
});

router.put('/updateonuuid/:id', async (req, res) => {
    const err = CategoryUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const categories = await CategoryModel.updateCategoryByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, categories ? 200 : 400, categories ? "Update Success" : "Update Failed", { status: categories });
});

router.delete('/deleteonuuid/:id', async (req, res) => {
    const categories = await CategoryModel.deleteCategoryByUUId(req.params.id);
    ApiResponse.sendResponse(res, categories === 1 ? 200 : 400, categories === 1 ? "Delete Success" : "Deletion Failed", { status: categories });
});

module.exports = router;