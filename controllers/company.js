const Company = require("../models/Company");
const Medicine = require("../models/Medicine");

const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis',
  port: 6379
});

const companiesAllFetch = async () => {
  try {
    const companies = await Company.findAll();
    redis.set('companies', JSON.stringify(companies));
    return companies;
  } catch (err) {
    const error = new Error("redis unable to fetch companies");
    error.statusCode = 500;
    throw error;
  }
};

exports.getCompany = async (req, res, next) => {
  try {
    redis.get('companies', async (error, companies) => {
      if (!companies) {
        try {
          const freshCompanies = await companiesAllFetch();
          const companyNames = freshCompanies.map(company => company.name);
          res.status(200).json({
            message: "fresh companies fetched",
            company: companyNames.sort(Intl.Collator().compare)
          });
        } catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        }
      } else {
        const companiesData = JSON.parse(companies);
        const companyNames = companiesData.map(company => company.name);
        res.status(200).json({
          message: "cached companies fetched",
          company: companyNames.sort(Intl.Collator().compare)
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
