const Location = require("../models/Location");
const Medicine = require("../models/Medicine");

const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis',
  port: 6379
});

const locationsAllFetch = async () => {
  try {
    const locations = await Location.findAll();
    redis.set('locations', JSON.stringify(locations));
    return locations;
  } catch (err) {
    const error = new Error("redis unable to fetch locations");
    error.statusCode = 500;
    throw error;
  }
};

exports.getLocation = async (req, res, next) => {
  try {
    redis.get('locations', async (error, locations) => {
      if (!locations) {
        try {
          const freshLocations = await locationsAllFetch();
          const locationNames = freshLocations.map(location => location.name);
          res.status(200).json({
            message: "fresh locations fetched",
            location: locationNames.sort(Intl.Collator().compare)
          });
        } catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        }
      } else {
        const locationsData = JSON.parse(locations);
        const locationNames = locationsData.map(location => location.name);
        res.status(200).json({
          message: "cached locations fetched",
          location: locationNames.sort(Intl.Collator().compare)
        });
      }
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
