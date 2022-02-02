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
