const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const itemController = require("../controllers/item");

// get /item/getItem
router.get("/:itemID", itemController.getItem);

// get /item/postItem
router.post("/", [body('name').notEmpty(), body('company').notEmpty(), body('location').notEmpty()], itemController.postItem);

module.exports = router;
