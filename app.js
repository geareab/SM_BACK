require("dotenv").config();

const port = process.env.PORT || 3000;

const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./config/database");

const itemRoutes = require("./routes/item");
const companyRoutes = require("./routes/company");
const locationRoutes = require("./routes/location");
const redisRoutes = require("./routes/redis");

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
app.use("/redis", redisRoutes);

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

// Test PostgreSQL connection and start server
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to PostgreSQL database successfully');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});
