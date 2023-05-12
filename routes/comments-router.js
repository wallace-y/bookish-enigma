const commentRouter = require("express").Router();
const {
  deleteComment,
  patchCommentById,
} = require("../controllers/controllers.js");

//delete a comment

commentRouter
  .delete("/:comment_id", deleteComment)
  .patch("/:comment_id", patchCommentById);

module.exports = commentRouter;
