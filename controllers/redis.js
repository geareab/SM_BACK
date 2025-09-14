const Medicine = require("../models/Medicine");

const Redis = require('ioredis');

const redis = new Redis({
    host: 'redis',
    port: 6379
});


const itemsAllFetch = async () => {
    try {
        const medicines = await Medicine.findAll();
        redis.set('items', JSON.stringify(medicines));
        return medicines;
    } catch (err) {
        const error = new Error("redis unable to fetch");
        error.statusCode = 500;
        throw error;
    }
};

exports.deleteRedisItems = (req, res, next) => {
    redis.del('items');
    res.status(200).json({ message: "deleted" });
};

//use /item/updateRedis/~~
exports.updateRedisItems = (req, res, next) => {
    itemsAllFetch().then(() => {
        res.status(200).json({ message: "redis key updated" });
    }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};