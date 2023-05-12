const format = require("pg-format");
const {
  checkReviewExists,
  checkValidCategory,
  checkCommentExists,
  checkUserExists,
} = require("../db/seeds/utils.js");
const connection = require("../db/connection.js");

function selectReviewById(review_id) {
  return connection
    .query(
      `SELECT r.review_id, r.title, r.designer, r.owner, r.review_img_url, r.review_body, r.category, r.created_at, r.votes, CAST(count(comment_id) as INT) as comment_count FROM reviews r LEFT JOIN comments c on r.review_id = c.review_id WHERE r.review_id = $1 GROUP BY r.review_id;`,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Resource not found." });
      } else {
        return rows;
      }
    });
}

function selectReviews(sort_by = "created_at", order = "DESC", category) {
  const validSortQueries = [
    "review_id",
    "created_at",
    "title",
    "designer",
    "owner",
    "category",
    "votes",
  ];
  const validOrderQueries = ["ASC", "DESC"];
  const validCategories = checkValidCategory(category);

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query." });
  }

  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query." });
  }

  const queryValues = [];
  let queryStr = `SELECT reviews.review_id, owner, title, category, review_img_url, 
  reviews.created_at, reviews.votes, designer, CAST(count(comment_id) as INT) as comment_count FROM reviews LEFT JOIN comments on reviews.review_id = comments.review_id`;

  if (category) {
    queryValues.push(category);
    queryStr += ` WHERE category = $1`;
  }

  queryStr += ` GROUP BY reviews.review_id`;

  if (sort_by) {
    queryStr += ` ORDER BY reviews.${sort_by}`;
  }

  if (order) {
    queryStr += ` ${order};`;
  } else {
    queryStr += ";";
  }

  const queryReview = connection.query(queryStr, queryValues);

  return Promise.all([validCategories, queryReview]).then((result) => {
    return result[1].rows;
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

function removeComment(comment_id) {
  const checkExists = checkCommentExists(comment_id);
  const query = connection.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [comment_id]
  );

  return Promise.all([checkExists, query]);
}

function updateReviewById(review_id, update) {
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

function selectUserByUsername(username) {
  return connection
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found." });
      } else {
        return rows[0];
      }
    });
}

function updateCommentById(comment_id, update) {
  return connection
    .query(`SELECT votes FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Resource not found." });
      }
      let newVotes = result.rows[0].votes + update.inc_votes;
      if (newVotes < 0) {
        return 0;
      } else {
        return newVotes;
      }
    })
    .then((newVotes) => {
      return connection
        .query(
          `UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *;`,
          [newVotes, comment_id]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
}

function addReview(review) {
  //checks that all required fields exists
  if (
    review.title === undefined ||
    review.designer === undefined ||
    review.owner === undefined ||
    review.review_body === undefined ||
    review.category === undefined
  ) {
    return Promise.reject({ status: 400, msg: "Malformed body." });
  }

  //checks the category of the review is valid
  const validCategories = checkValidCategory(review.category);

  //check user is valid too...
  const validUser = checkUserExists(review.owner);

  //formats the review ready to insert into the table
  const newReview = [
    review.title,
    review.designer,
    review.owner,
    review.review_img_url || "https://placebear.com/700/700",
    review.review_body,
    review.category,
  ];
  const query = format(
    `INSERT INTO reviews (title,designer,owner,review_img_url,review_body,category) VALUES %L RETURNING *;`,
    [newReview]
  );

  const addValidReview = connection
    .query(query)
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Resource not found." });
      } else {
        return result.rows[0].review_id;
      }
    })
    .then((review_id) => {
      return selectReviewById(review_id);
    });

  return Promise.all([validCategories, validUser, addValidReview]).then(
    (result) => {
      return result[2][0];
    }
  );
}

module.exports = {
  selectReviewById,
  selectReviews,
  updateReviewById,
  addComment,
  selectComments,
  removeComment,
  selectUserByUsername,
  updateCommentById,
  addReview,
};
