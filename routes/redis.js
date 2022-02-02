const express = require("express");

const router = express.Router();

const redisController = require("../controllers/redis");
const isAuth = require('../middleware/is-auth');

// get /company/getCompany
router.get("/delete", isAuth, redisController.deleteRedisItems);
router.get("/update", isAuth, redisController.updateRedisItems);

module.exports = router;
