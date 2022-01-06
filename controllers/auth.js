const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPW) => {
      const user = new User({
        email: email,
        username: username,
        password: hashedPW,
      });
      user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "user created", username: username });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        const error = new Error("no user Found please signup");
        error.statusCode = 401;
        throw error;
      }
      loadeduser = user;

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("wrong password");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign({
        username: loadeduser.username,
        userID: loadeduser._id.toString(),
      }, "pooppooppooppoop", {expiresIn: '24h'});

      res.status(200).json({token : token, userID: loadeduser._id.toString()})
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
