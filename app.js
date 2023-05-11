const express = require("express");
const {
  getCategories,
  getAllEndpoints,
  getReviewsById,
  getReviews,
  patchReviewsById,
} = require("./controllers/controllers.js");
const app = express();

app.use(express.json());

// all endpoints, endpoint
app.get("/api", getAllEndpoints);

// category endpoints
app.get("/api/categories", getCategories);

//review endpoints
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsById);

app.patch("/api/reviews/:review_id", patchReviewsById);

//error handling middleware

//handling 404 errors - no available endpoint
app.use("/api/*", (req, res) => {
  res.status(404).send({ msg: "Page not found." });
});

//handling 500 errors
app.use((err, req, res, next) => {
  //handle custom errors later
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  //psql errors
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request." });
  }
  // if the error hasn't been identified,
  // respond with an internal server error
  res.status(500).send({ msg: "Internal Server Error" });

  console.log(err)
});

module.exports = app;
