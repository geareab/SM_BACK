const { validationResult } = require("express-validator");

const Item = require("../models/item");

exports.getItem = (req, res, next) => {
  var itemID = req.params.itemName;
  //itemID = itemID.substring(0, 1);
  if (itemID ==='~~') {
    Item.find()
      .then((item) => {
        res.status(200).json({ message: "item fetched", item: item });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
  else{
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
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  }
};

exports.postItem = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("cannot be null");
    error.statusCode = 422;
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
      res.status(201).json({
        message: "Post created successfully!",
        item: { itemname: itemname, company: company, location: location },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.putItem = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("cannot be null");
    error.statusCode = 422;
    throw error;
  }

  var itemID = req.params.itemID;

  const itemname = req.body.name;
  const company = req.body.company;
  const location = req.body.location;

  Item.findById(itemID)
    .then((item) => {
      if (!item) {
        const error = new Error("Could not find item.");
        error.statusCode = 404;
        throw error;
      }
      item.name = itemname;
      item.location = location;
      item.company = company;
      return item.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Item updated!", item: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteItem = (req, res, next) => {
  var itemID = req.params.itemID;
  Item.findById(itemID)
    .then((item) => {
      if (!item) {
        const error = new Error("Could not find item.");
        error.statusCode = 404;
        throw error;
      }
      return Item.findByIdAndRemove(itemID);
    })
    .then(() => {
      res.status(200).json({ message: "Item deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
