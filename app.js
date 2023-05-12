const express = require("express");
const {
  getCategories,
  getAllEndpoints,
  getReviewsById,
  getReviews,
  patchReviewsById,
  postComment,
  getComments,
  deleteComment,
} = require("./controllers/controllers.js");
const app = express();

app.use(express.json());

// all endpoints, endpoint
app.get("/api", getAllEndpoints);

// category endpoints
app.get("/api/categories", getCategories);

//review get endpoints
app.get("/api/reviews", getReviews);

//review endpoints
app.get("/api/reviews/:review_id/comments", getComments);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews", getReviews);

//review post endpoints
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchReviewsById);

//delete endpoints
app.delete("/api/comments/:comment_id", deleteComment);

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
  //Key (<column-name>)=(XXX) is not present in table
  if (err.code === "23503") {
    res.status(404).send({ msg: "Resource not found." });
  }
  // if the error hasn't been identified,
  // respond with an internal server error
  else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
