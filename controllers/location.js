const Item = require("../models/item");

exports.getLocation = (req, res, next) => {
  var locationID = req.params.locationID;
  //locationID = locationID.substring(0, 1);
  Item.find({ location: new RegExp("^" + locationID, "i") })
    .then((location) => {
      if (!location) {
        const error = new Error("not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "location fetched", location: location });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
