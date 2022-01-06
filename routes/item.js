const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const itemController = require("../controllers/item");

// search name
router.get("/:itemName", itemController.getItem);

//edit item
router.put(
  "/:itemID",
  [
    body("name").notEmpty(),
    body("company").notEmpty(),
    body("location").notEmpty(),
  ],
  itemController.putItem
);

// get /item/postItem
router.post(
  "/",
  [
    body("name").notEmpty(),
    body("company").notEmpty(),
    body("location").notEmpty(),
  ],
  itemController.postItem
);
//delete
router.delete("/:itemID", itemController.deleteItem);

module.exports = router;
