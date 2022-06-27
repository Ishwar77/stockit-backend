const express = require("express");
const router = express.Router();
const ApiResponse = require('../../models/apiResponse');
const OtherModels = require('./others.model');

router.get('/categoryandbranddata', async (req, res) => {
    try {
      const rows = await OtherModels.getCategorySpecificJoinDetails();
      ApiResponse.sendResponse(res, 200, "Success", rows);
    } catch (e) {
      console.log(e);
      ApiResponse.sendResponse(res, 400, "Failed", e);
    }
  });

  router.get('/opportunitydata', async (req, res) => {
    try {
      const rows = await OtherModels.getOpportunityDetails();
      ApiResponse.sendResponse(res, 200, "Success", rows);
    } catch (e) {
      console.log(e);
      ApiResponse.sendResponse(res, 400, "Failed", e);
    }
  });

  module.exports = router;