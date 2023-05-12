const connection = require("../connection.js");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkReviewExists = (review_id) => {
  return connection
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((result) => {
      if (result.rows.length === 0 && review_id) {
        return Promise.reject({ status: 404, msg: "Review not found." });
      }
    });
};

exports.checkValidCategory = (category) => {
  return connection
    .query(`SELECT * FROM categories WHERE slug = $1;`, [category])
    .then((result) => {
      if (result.rows.length === 0 && category) {
        return Promise.reject({ status: 404, msg: "Category not found." });
      }
    });
};

exports.checkCommentExists = (comment_id) => {
  return connection
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
      if (result.rows.length === 0 && comment_id) {
        return Promise.reject({ status: 404, msg: "Comment not found." });
      }
    });
};

exports.checkUserExists = (username) => {
  return connection
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((result) => {
      if (result.rows.length === 0 && username) {
        return Promise.reject({ status: 404, msg: "User not found." });
      }
    });
};
