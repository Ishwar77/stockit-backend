const express = require("express");
const router = express.Router();
const ApiResponse = require('../models/apiResponse');

const usersRoutes = require('./users/users.router');
const storesRoutes = require('./stores/stores.router');
const brandRoutes = require('./brand/brand.router');
const taskRoutes = require('./tasks/tasks.router');
const categoryRoutes = require('./category/category.router');
const productRoutes = require('./product/product.router');
const otherRoutes = require('./others/others.routes');

// default route listener
router.get('/', (req, res) => {
    ApiResponse.sendResponse(res, 200, "Listening to API V1 GET");
});

router.use('/users', usersRoutes);
router.use('/stores', storesRoutes);
router.use('/brand', brandRoutes);
router.use('/tasks', taskRoutes);
router.use('/category', categoryRoutes);
router.use('/products', productRoutes);
router.use('/others', otherRoutes)

module.exports = router;