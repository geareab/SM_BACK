const express = require("express");
//const { body } = require('express-validator/check');

const router = express.Router();

const locationController = require("../controllers/location");

// get /location/getLocation
router.get("/:locationID", locationController.getLocation);

module.exports = router;
