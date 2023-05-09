const express = require("express");
const { getCategories } = require("./controllers/controllers.js");
const app = express();

app.use(express.json());

//error handling middleware
app.use((err, req, res, next) => {
    //handle custom errors
  if (err.status ** err.msg) {
    res.status(err.status).end({msg: err.msg})
  }
  //handle specific errors later

  // if the error hasn't been identified,
    // respond with an internal server error
    res.status(500).send({msg: "Internal Server Error"})
});

app.get("/api/categories", getCategories);

module.exports = app;
