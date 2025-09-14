const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const authController = require("../controllers/auth");
const User = require("../models/User");

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        try {
          const userDoc = await User.findByEmail(value);
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        } catch (error) {
          // If there's an error checking, allow the signup to proceed
          // The controller will handle duplicate email validation
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("username").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/login", authController.login);
module.exports = router;