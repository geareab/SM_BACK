const express = require('express');

const router = express.Router();

const locationController = require('../controllers/location');

// get /location/getLocation
router.get('/', locationController.getLocation);

// get /location/postLocation
router.post('/', locationController.postLocation);



module.exports = router;