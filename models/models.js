const format = require("pg-format");
const connection = require("../db/connection.js");
const { checkReviewExists } = require("../db/seeds/utils.js");

function selectReviewById(review_id) {
  return connection
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Resource not found." });
      } else {
        return rows;
      }
    });
}

function selectReviews(sort_by = "review_id") {
  const validSortQueries = ["review_id", "created_at"];
  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query." });
  }

  return connection
    .query(
      `SELECT reviews.review_id, owner, title, category, review_img_url, 
      reviews.created_at, reviews.votes, designer, CAST(count(comment_id) as INT) as comment_count FROM reviews LEFT JOIN comments on reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.${sort_by};`
    )
    .then((result) => {
      return result.rows;
    });
}

function addComment(review_id, review) {
  if (review.username === undefined || review.body === undefined) {
    return Promise.reject({ status: 400, msg: "Malformed body." });
  }
  const newComment = [review.username, review.body, review_id];
  const query = format(
    `INSERT INTO comments (author,body,review_id) VALUES %L RETURNING *;`,
    [newComment]
  );
  return connection.query(query).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource not found." });
    } else {
      return result;
    }
  });
}

function selectComments(review_id) {
  const checkExists = checkReviewExists(review_id);
  const query = connection.query(
    `SELECT comment_id,comments.votes,comments.created_at,comments.author,comments.body,comments.review_id FROM comments WHERE comments.review_id = $1;`,
    [review_id]
  );

  return Promise.all([checkExists, query]).then((result) => {
    return result[1].rows;
  });
}

function updateReviewById(review_id, update) {
  //update the damn thing

  return connection
    .query(`SELECT votes FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Resource not found." });
      }
      return result.rows[0].votes + update.inc_votes;
    })
    .then((newVotes) => {
      return connection
        .query(
          `UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *;`,
          [newVotes, review_id]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
}


module.exports = {
  selectReviewById,
  selectReviews,
  updateReviewById,
  addComment,
  selectComments,
};
