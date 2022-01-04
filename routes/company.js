const express = require('express');

const router = express.Router();

const companyController = require('../controllers/company');

// get /company/getCompany
router.get('/', companyController.getCompany);

// get /company/postCompany
router.post('/', companyController.postCompany);



module.exports = router;