const express = require("express");

const router = express.Router();

const companyController = require("../controllers/company");
const isAuth = require('../middleware/is-auth');

// get /company/getCompany
router.get("/:companyID",isAuth, companyController.getCompany);

module.exports = router;
