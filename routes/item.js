const express = require('express');

const router = express.Router();

const itemController = require('../controllers/item');

// get /item/getItem
router.get('/', itemController.getItem);

// get /item/postItem
router.post('/', itemController.postItem);



module.exports = router;