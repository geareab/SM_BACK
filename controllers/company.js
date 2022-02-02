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

exports.getCompany = (req, res, next) => {

  redis.get('items', (error, items) => {
    if (!items) {
      itemsAllFetch().then(() => {
        redis.get('items', (error, items) => {
          const onlyCompany = JSON.parse(items).map(({ company }) => {
            return { company };
          })
          var array = []
          onlyCompany.map(({ company }) => {
            array.push(company);
          })
          //delete duplicate
          var uniqArray = [...new Set(array)];

          // .sort(Intl.Collator().compare) used to ignore uppercase or lowercase
          res.status(200).json({ message: "fresh company fetched", company: uniqArray.sort(Intl.Collator().compare) });
        })
      }).catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
    }
    else {
      const onlyCompany = JSON.parse(items).map(({ company }) => {
        return { company };
      })
      var array = []
      onlyCompany.map(({ company }) => {
        array.push(company);
      })
      //delete duplicate
      var uniqArray = [...new Set(array)];

      // .sort(Intl.Collator().compare) used to ignore uppercase or lowercase
      res.status(200).json({ message: "cached company fetched", company: uniqArray.sort(Intl.Collator().compare) });
    }


  })
};
