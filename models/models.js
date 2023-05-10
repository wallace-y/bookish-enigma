const connection = require("../db/connection.js");

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
      reviews.created_at, reviews.votes, designer, count(comment_id) as comment_count FROM reviews LEFT JOIN comments on reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.${sort_by};`
    )
    .then((result) => {
      return result.rows;
    });
}

module.exports = {
  selectReviewById,
  selectReviews,
};
