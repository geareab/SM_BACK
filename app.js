require("dotenv").config();

const port = process.env.PORT || 3000;
const mongopass = process.env.PASS;
const mongouser = process.env.USERM;

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const itemRoutes = require("./routes/item");
const companyRoutes = require("./routes/company");
const locationRoutes = require("./routes/location");

const authRoutes = require("./routes/auth");

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
app.use("/auth", authRoutes);


app.all("*", function (req, res) {
  res.status(404).send({ message: "invalid url/method" });
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.setHeader("Content-Type", "application/json");
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://" +
    mongouser +
    ":" +
    mongopass +
    "@cluster0.xlknb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => console.log(err));
