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

module.exports = {
  selectReviewById,
  selectReviews,
  selectComments,
};
