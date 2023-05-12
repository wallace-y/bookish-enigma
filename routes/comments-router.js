const commentRouter = require("express").Router();
const { deleteComment } = require("../controllers/controllers.js");

//delete a comment

commentRouter.delete("/:comment_id", deleteComment);

module.exports = commentRouter;
