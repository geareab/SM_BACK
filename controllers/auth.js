const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signup = async (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      const error = new Error("Username already taken");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashedPW = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await User.create(email, hashedPW, username);
    
    res.status(201).json({ message: "user created", username: username });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    
    // Find user by username
    const user = await User.findByUsername(username);
    if (!user) {
      const error = new Error("no user Found please signup");
      error.statusCode = 401;
      throw error;
    }

    // Compare password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("wrong password");
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        username: user.username,
        userID: user.id.toString(),
      },
      process.env.JWT_SECRET || "pooppooppooppoop",
      { expiresIn: "24h" }
    );

    res.status(200).json({ token: token, userID: user.id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};