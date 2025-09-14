const fuse = require("./fuseSearch");

const { validationResult } = require("express-validator");

const Medicine = require("../models/Medicine");
const Company = require("../models/Company");
const Location = require("../models/Location");
const Redis = require("ioredis");

const redis = new Redis({
  host: "redis",
  port: 6379,
});

const itemsAllFetch = async () => {
  try {
    const medicines = await Medicine.findAll();
    redis.set("items", JSON.stringify(medicines));
    return medicines;
  } catch (err) {
    const error = new Error("redis unable to fetch");
    error.statusCode = 500;
    throw error;
  }
};

exports.getItem = (req, res, next) => {
  var itemID = req.params.itemName;
  var amount = req.params.amount;
  redis.get("items", (error, items) => {
    if (items != null) {
      const startsWithX = JSON.parse(items).filter((item) =>
        item.name.toLowerCase().startsWith(itemID.toLowerCase().slice(0, 2))
      );
      res.status(200).json({
        message: "cached item fetched",
        item: fuse.applySortFilter(startsWithX, itemID, amount),
      });
    } else {
      itemsAllFetch()
        .then(() => {
          redis.get("items", (error, items) => {
            const startsWithX = JSON.parse(items).filter((item) =>
              item.name.toLowerCase().startsWith(itemID.slice(0, 2))
            );
            res.status(200).json({
              message: "new item fetched",
              item: fuse.applySortFilter(startsWithX, itemID, amount),
            });
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    }
  });
};

exports.getForcedItem = (req, res, next) => {
  var itemID = req.params.itemName;
  var amount = req.params.amount;
  redis.get("items", (error, items) => {
    if (items != null) {
      const startsWithX = JSON.parse(items).filter((item) =>
        item.name.toLowerCase().startsWith(itemID.slice(0, 2))
      );
      const startsWith = JSON.parse(items);

      const startsWithXArray = fuse.applySortFilter(
        startsWithX,
        itemID,
        amount
      );
      const startsWithArray = fuse.applySortFilter(
        startsWith,
        itemID,
        parseInt(amount, 10) + 5
      );

      //console.log(startsWithXArray);
      //console.log(startsWithArray);
      var newarray = [];
      startsWithArray.forEach(function (el) {
        console.log(el.item._id);

        console.log(
          startsWithXArray.findIndex((x) => x.item._id === el.item._id)
        );
        if (startsWithXArray.findIndex((x) => x.item._id === el.item._id) < 0) {
          newarray.push(el);
        }
      });
      console.log(newarray);

      res
        .status(200)
        .json({ message: "cached Forced item fetched", item: newarray });
    } else {
      itemsAllFetch()
        .then(() => {
          redis.get("items", (error, items) => {
            const startsWithX = JSON.parse(items).filter((item) =>
              item.name.toLowerCase().startsWith(itemID.slice(0, 2))
            );
            const startsWith = JSON.parse(items);

            res.status(200).json({
              message: "new Forced item fetched",
              item: fuse.applySortFilter(startsWith, itemID, amount),
            });
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    }
  });
};

exports.postItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("cannot be null");
    error.statusCode = 422;
    throw error;
  }

  try {
    const itemname = req.body.name;
    const companyName = req.body.company;
    const locationName = req.body.location;

    // Find or create company
    let company = await Company.findByName(companyName);
    if (!company) {
      company = await Company.create(companyName);
    }

    // Find or create location
    let location = await Location.findByName(locationName);
    if (!location) {
      location = await Location.create(locationName);
    }

    // Create medicine
    const medicine = await Medicine.create(itemname, company.id, location.id);

    // Clear Redis cache to force refresh
    redis.del("items");
    redis.del("companies");
    redis.del("locations");

    res.status(201).json({
      message: "Medicine created successfully!",
      item: {
        name: itemname,
        company: companyName,
        location: locationName,
        id: medicine.id
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("cannot be null");
    error.statusCode = 422;
    throw error;
  }

  try {
    const itemID = req.params.itemID;
    const itemname = req.body.name;
    const companyName = req.body.company;
    const locationName = req.body.location;

    // Check if medicine exists
    const existingMedicine = await Medicine.findById(itemID);
    if (!existingMedicine) {
      const error = new Error("Could not find medicine.");
      error.statusCode = 404;
      throw error;
    }

    // Find or create company
    let company = await Company.findByName(companyName);
    if (!company) {
      company = await Company.create(companyName);
    }

    // Find or create location
    let location = await Location.findByName(locationName);
    if (!location) {
      location = await Location.create(locationName);
    }

    // Update medicine
    const updatedMedicine = await Medicine.update(itemID, itemname, company.id, location.id);

    // Clear Redis cache to force refresh
    redis.del("items");
    redis.del("companies");
    redis.del("locations");

    res.status(200).json({
      message: "Medicine updated!",
      item: {
        id: updatedMedicine.id,
        name: itemname,
        company: companyName,
        location: locationName
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const itemID = req.params.itemID;

    // Check if medicine exists
    const existingMedicine = await Medicine.findById(itemID);
    if (!existingMedicine) {
      const error = new Error("Could not find medicine.");
      error.statusCode = 404;
      throw error;
    }

    // Delete medicine
    const deleted = await Medicine.delete(itemID);

    if (deleted) {
      // Clear Redis cache to force refresh
      redis.del("items");
      redis.del("companies");
      redis.del("locations");

      res.status(200).json({ message: "Medicine deleted!" });
    } else {
      const error = new Error("Failed to delete medicine.");
      error.statusCode = 500;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//use /item/deleteRedis/~~
exports.deleteRedisItems = (req, res, next) => {
  redis.del("items");
  res.status(200).json({ message: "deleted" });
};

//use /item/updateRedis/~~
exports.updateRedisItems = (req, res, next) => {
  itemsAllFetch().then(() => {
    res.status(200).json({ message: "redis key updated" });
  });
};
