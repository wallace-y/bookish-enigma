const connection = require("../db/connection.js");

function getCategories(req, res, next) {
  return connection
    .query(`SELECT * FROM categories;`)
    .then((data) => {
      res.status(200).send(data.rows);
    });
}

module.exports = {
  getCategories,
};
