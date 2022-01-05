const express = require("express");

const router = express.Router();

const companyController = require("../controllers/company");

// get /company/getCompany
router.get("/:companyID", companyController.getCompany);

module.exports = router;
