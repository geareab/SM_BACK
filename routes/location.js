const express = require("express");
//const { body } = require('express-validator/check');

const router = express.Router();

const locationController = require("../controllers/location");
const isAuth = require('../middleware/is-auth');

// get /location/getLocation
router.get("/:locationID",isAuth, locationController.getLocation);

module.exports = router;
