const fuse = require('./fuseSearch');

const { validationResult } = require("express-validator");

const Item = require("../models/item");
const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis',
  port: 6379
});

const itemsAllFetch = async () => {
  await Item.find().then((item) => {
    redis.set('items', JSON.stringify(item));
  }).catch((err) => {
    const error = new Error("redis unable to fetch");
    error.statusCode = 500;
    throw error;
  });
};

exports.getItem = (req, res, next) => {

  var itemID = req.params.itemName;
  var amount = req.params.amount;
  redis.get('items', (error, items) => {
    if (items != null) {
      const startsWithX = JSON.parse(items).filter((item) => item.name.toLowerCase().startsWith(itemID.slice(0, 2)));
      res.status(200).json({ message: "cached item fetched", item: fuse.applySortFilter(startsWithX, itemID, amount) });
    }
    else {
      itemsAllFetch().then(() => {
        redis.get('items', (error, items) => {
          const startsWithX = JSON.parse(items).filter((item) => item.name.toLowerCase().startsWith(itemID.slice(0, 2)));
          res.status(200).json({ message: "new item fetched", item: fuse.applySortFilter(startsWithX, itemID, amount) });
        })
      }).catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
    }
  })
};


exports.getForcedItem = (req, res, next) => {

  var itemID = req.params.itemName;
  var amount = req.params.amount;
  redis.get('items', (error, items) => {
    if (items != null) {
      const startsWithX = JSON.parse(items).filter((item) => item.name.toLowerCase().startsWith(itemID.slice(0, 2)));
      const startsWith = JSON.parse(items);

      res.status(200).json({ message: "cached item fetched", item: fuse.applySortFilter(startsWith, itemID, amount) });
    }
    else {
      itemsAllFetch().then(() => {
        redis.get('items', (error, items) => {
          const startsWithX = JSON.parse(items).filter((item) => item.name.toLowerCase().startsWith(itemID.slice(0, 2)));
          const startsWith = JSON.parse(items);

          res.status(200).json({ message: "new item fetched", item: fuse.applySortFilter(startsWith, itemID, amount) });
        })
      }).catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
    }
  })
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

//use /item/deleteRedis/~~
exports.deleteRedisItems = (req, res, next) => {
  redis.del('items');
  res.status(200).json({ message: "deleted" });

};

//use /item/updateRedis/~~
exports.updateRedisItems = (req, res, next) => {
  itemsAllFetch().then(() => {
    res.status(200).json({ message: "redis key updated" });
  })
};

