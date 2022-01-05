const { validationResult } = require("express-validator");

const Item = require("../models/item");

exports.getItem = (req, res, next) => {
  var itemID = req.params.itemID;
  //itemID = itemID.substring(0, 1);
  Item.find({ name: new RegExp("^" + itemID, "i") })
    .then((item) => {
      if (!item) {
        const error = new Error("not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "item fetched", item: item });
    })
    .catch((err) => {
      if (!err.stausCode) {
        err.stausCode = 500;
      }
      next(err);
    });
};

exports.postItem = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("cannot be null");
    error.stausCode = 422;
    throw error;
  }
  const itemname = req.body.name;
  const company = req.body.company;
  const location = req.body.location;

  // Create post in db
  const item = new Item({
    name: itemname,
    company: company,
    location: location,
  });

  item
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully!",
        item: { itemname: itemname, company: company, location: location },
      });
    })
    .catch((err) => {
      if (!err.stausCode) {
        err.stausCode = 500;
      }
      next(err);
    });
};
