const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const itemController = require("../controllers/item");
const isAuth = require('../middleware/is-auth');

// search name
router.get("/:itemName", isAuth, itemController.getItem);

router.get("/deleteRedis/:itemName", isAuth, itemController.deleteRedisItems);
router.get("/updateRedis/:itemName", isAuth, itemController.updateRedisItems);



//edit item
router.put(
  "/:itemID", isAuth,
  [
    body("name").notEmpty(),
    body("company").notEmpty(),
    body("location").notEmpty(),
  ],
  itemController.putItem
);

// get /item/postItem
router.post(
  "/", isAuth,
  [
    body("name").notEmpty(),
    body("company").notEmpty(),
    body("location").notEmpty(),
  ],
  itemController.postItem
);
//delete
router.delete("/:itemID", isAuth, itemController.deleteItem);

module.exports = router;
