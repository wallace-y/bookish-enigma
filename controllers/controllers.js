const connection = require("../db/connection.js");
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
  console.log("In this controller");
  fs.readFile("./endpoints.json", "utf-8").then((data) => {
    const parsedData = JSON.parse(data);
    res.status(200).send(parsedData);
  }).catch(next);
}

module.exports = {
  getCategories,
  getAllEndpoints,
};
