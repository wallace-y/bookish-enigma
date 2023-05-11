const connection = require("../db/connection.js");
const {
  selectReviewById,
  selectReviews,
  addComment,
  selectComments,
  removeComment,
} = require("../models/models.js");
const fs = require("fs/promises");

function getCategories(req, res, next) {
  return connection
    .query(`SELECT * FROM categories;`)
    .then((data) => {
      res.status(200).send(data.rows);
    })
    .catch(next);
}

function getAllEndpoints(req, res, next) {
  // read and return file
  fs.readFile("./endpoints.json", "utf-8")
    .then((data) => {
      const parsedData = JSON.parse(data);
      res.status(200).send(parsedData);
    })
    .catch(next);
}

function getReviewsById(req, res, next) {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
}

function getReviews(req, res, next) {
  const { sort_by } = req.query;
  selectReviews(sort_by)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
}

function postComment(req, res, next) {
  const { review_id } = req.params;
  const review = req.body;
  //activate the model
  addComment(review_id, review)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

function getComments(req, res, next) {
  const { review_id } = req.params;

  selectComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(({rows}) => {
      const deletedComment = rows; 
      res.status(204).send({ deletedComment });
    })
    .catch(next);
}

module.exports = {
  getCategories,
  getAllEndpoints,
  getReviewsById,
  getReviews,
  postComment,
  getComments,
  deleteComment,
};
