const connection = require("../db/connection.js");
const {
  selectReviewById,
  selectReviews,
  updateReviewById,
  addComment,
  selectComments,
  removeComment,
  selectUserByUsername,
  updateCommentById,
  addReview,
  addCategory,
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
  const { sort_by, order, category, limit, p } = req.query;
  selectReviews(sort_by, order, category, limit, p)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch(next);
}

function postComment(req, res, next) {
  const { review_id } = req.params;
  const review = req.body;
  //activate the model
  addComment(review_id, review)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch(next);
}

function getComments(req, res, next) {
  const { review_id } = req.params;
  const { limit, p } = req.query;

  selectComments(review_id, limit, p)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
}

function getUsers(req, res, next) {
  return connection
    .query(`SELECT username,name,avatar_url FROM users;`)
    .then(({ rows }) => {
      const users = rows;
      res.status(200).send(users);
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(({ rows }) => {
      const deletedComment = rows;
      res.status(204).send({ deletedComment });
    })
    .catch(next);
}

function patchReviewsById(req, res, next) {
  const { review_id } = req.params;
  const update = req.body;
  updateReviewById(review_id, update)
    .then((review) => {
      res.status(202).send(review);
    })
    .catch(next);
}

function getUsersByUsername(req, res, next) {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
}

function patchCommentById(req, res, next) {
  const { comment_id } = req.params;
  const update = req.body;
  updateCommentById(comment_id, update)
    .then((comment) => {
      res.status(202).send({ comment });
    })
    .catch(next);
}

function postReview(req, res, next) {
  const review = req.body;
  addReview(review)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
}

function postCategory(req, res, next) {
  const category = req.body;
  addCategory(category)
    .then((category) => {
      res.status(201).send({ category });
    })
    .catch(next);
}

module.exports = {
  getCategories,
  getAllEndpoints,
  getReviewsById,
  getReviews,
  patchReviewsById,
  postComment,
  getComments,
  getUsers,
  deleteComment,
  getUsersByUsername,
  patchCommentById,
  postReview,
  postCategory,
};
