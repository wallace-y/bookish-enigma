const connection = require("../db/connection.js");
const { selectReviewById } = require("../models/models.js");
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
  selectReviewById(review_id).then((review) => {
    res.status(200).send({ review });
  })
  .catch(next);
}

module.exports = {
  getCategories,
  getAllEndpoints,
  getReviewsById,
};
