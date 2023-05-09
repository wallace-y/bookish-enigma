const express = require("express");
const {
  getCategories,
  getAllEndpoints,
} = require("./controllers/controllers.js");
const app = express();

app.use(express.json());

// all endpoints, endpoint
app.get("/api", getAllEndpoints);


// category endpoints
app.get("/api/categories", getCategories);

//error handling middleware

//handling 404 errors - no available endpoint
app.use("/api/*", (req, res) => {
  res.status(404).send({ msg: "Page not found." });
});

//handling 500 errors
app.use((err, req, res, next) => {
  //handle custom errors later
  if (err.status && err.msg) {
    res.status(err.status).end({ msg: err.msg });
  }
  // if the error hasn't been identified,
  // respond with an internal server error
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
