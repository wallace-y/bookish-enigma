const reviewRouter = require("express").Router();
const {
  getReviews,
  getReviewsById,
  getComments,
  postComment,
  patchReviewsById,
  postReview,
  deleteReview,
} = require("../controllers/controllers.js");

//get all reviews
reviewRouter
  .get("/", getReviews)
  .get("/:review_id", getReviewsById)
  .get("/:review_id/comments", getComments)
  .post("/:review_id/comments", postComment)
  .patch("/:review_id", patchReviewsById)
  .post("/", postReview)
  .delete("/:review_id", deleteReview);

module.exports = reviewRouter;
