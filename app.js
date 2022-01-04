const express = require("express");
const bodyParser = require("body-parser");

const itemRoutes = require("./routes/item");
const companyRoutes = require("./routes/company");
const locationRoutes = require("./routes/location");


const app = express();

//default
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/item", itemRoutes);
app.use("/company", companyRoutes);
app.use("/location", locationRoutes);


app.listen(8080);
