const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const ProductModel = require('./product.model');
const ProductUtil = require('./product.util');
const MyConst = require('../utils');

console.log("PRODUCTS Router Loaded !");

router.get('/', async (req, res) => {
    const products = await ProductModel.getProducts()
    ApiResponse.sendResponse(res, 200, "Getting all Products", products);
});

router.get('/:id', async (req, res) => {
    const productId = parseInt(req.params.id) || 0;
    const products = await ProductModel.getProductById(productId)
    ApiResponse.sendResponse(res, 200, "Getting Products on ID", products);
});

router.get('/barcode/:bardcode',async (req, res)=>{
    const barcode = req.params.bardcode || null;
    const products = await ProductModel.getProductByBarcode(barcode)
    ApiResponse.sendResponse(res, 200, "Getting Products by Barcode", products)
})

router.post('/', async (req, res) => {
    const err = ProductUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const products = await ProductModel.createProduct(req.body);
    ApiResponse.sendResponse(res, products ? 200 : 400, products ? "Creation Success" : "Creation Failed", products);
});

router.put('/:id', async (req, res) => {
    const productId = parseInt(req.params.id) || 0;
    if (!productId) {
        const msg = "Product: PUT Id = " + productId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Product Id seems invalid", msg);
        return;
    }
    const err = ProductUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    //console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const products = await ProductModel.updateProductById(productId, req.body);
    ApiResponse.sendResponse(res, products ? 200 : 400, products ? "Update Success" : "Update Failed", { status: products });
});

router.delete('/:id', async (req, res) => {
    const productId = parseInt(req.params.id) || 0;
    if (!productId) {
        const msg = "Product: PUT Id = " + productId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Product ID seems invalid", msg);
        return;
    }
    const products = await ProductModel.deleteProductById(productId);
    // console.log(products);
    ApiResponse.sendResponse(res, products === 1 ? 200 : 400, products === 1 ? "Delete Success" : "Deletion Failed", { status: products });
});

//UUID operations
router.get('/uuid/:id', async (req, res) => {
    const products = await ProductModel.getProductByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Products", products);
});

router.put('/updateonuuid/:id', async (req, res) => {
    const err = ProductUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const products = await ProductModel.updateProductByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, products ? 200 : 400, products ? "Update Success" : "Update Failed", { status: products });
});

router.delete('/deleteonuuid/:id', async (req, res) => {
    const products = await ProductModel.deleteProductByUUId(req.params.id);
    ApiResponse.sendResponse(res, products === 1 ? 200 : 400, products === 1 ? "Delete Success" : "Deletion Failed", { status: products });
});

module.exports = router;