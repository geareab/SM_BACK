const Item = require("../models/item");

exports.getCompany = (req, res, next) => {
  var companyID = req.params.companyID;
  //companyID = companyID.substring(0, 1);

  Item.find({ company: new RegExp("^" + companyID, "i") })
    .then((company) => {
      if (!company) {
        const error = new Error("not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "company fetched", company: company });
    })
    .catch((err) => {
      if (!err.stausCode) {
        err.stausCode = 500;
      }
      next(err);
    });
};
