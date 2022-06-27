const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const BrandModel = require('./brand.model');
const BrandsUtil = require('./brand.util');
const MyConst = require('../utils');

console.log("BRANDS Router Loaded !");

router.get('/', async (req, res) => {
    const brands = await BrandModel.getBrands()
    ApiResponse.sendResponse(res, 200, "Getting all Brands", brands);
});

router.get('/:id', async (req, res) => {
    const brandId = parseInt(req.params.id) || 0;
    const brands = await BrandModel.getBrandById(brandId)
    ApiResponse.sendResponse(res, 200, "Getting Brands on ID", brands);
});

router.post('/', async (req, res) => {
    const err = BrandsUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const brands = await BrandModel.createBrands(req.body);
    ApiResponse.sendResponse(res, brands ? 200 : 400, brands ? "Creation Success" : "Creation Failed", brands);
});

router.put('/:id', async (req, res) => {
    const brandId = parseInt(req.params.id) || 0;
    if (!brandId) {
        const msg = "Brand: PUT Id = " + brandId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Brand Id seems invalid", msg);
        return;
    }
    const err = BrandsUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    //console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const brands = await BrandModel.updateBrandsById(brandId, req.body);
    ApiResponse.sendResponse(res, brands ? 200 : 400, brands ? "Update Success" : "Update Failed", { status: brands });
});

router.delete('/:id', async (req, res) => {
    const brandId = parseInt(req.params.id) || 0;
    if (!brandId) {
        const msg = "Brands: PUT Id = " + brandId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Brand ID seems invalid", msg);
        return;
    }
    const brands = await BrandModel.deleteBrandById(brandId);
    // console.log(brands);
    ApiResponse.sendResponse(res, brands === 1 ? 200 : 400, brands === 1 ? "Delete Success" : "Deletion Failed", { status: brands });
});

//UUID operations
router.get('/uuid/:id', async (req, res) => {
    const brands = await BrandModel.getBrandsByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Brands", brands);
});

router.put('/updateonuuid/:id', async (req, res) => {
    const err = BrandsUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const brands = await BrandModel.updateBrandsByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, brands ? 200 : 400, brands ? "Update Success" : "Update Failed", { status: brands });
});

router.delete('/deleteonuuid/:id', async (req, res) => {
    const brands = await BrandModel.deleteBrandsByUUId(req.params.id);
    ApiResponse.sendResponse(res, brands === 1 ? 200 : 400, brands === 1 ? "Delete Success" : "Deletion Failed", { status: brands });
});

module.exports = router;