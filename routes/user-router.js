const userRouter = require("express").Router();
const {
  getUsers,
  getUsersByUsername,
} = require("../controllers/controllers.js");

//get all users
userRouter.get("/", getUsers).get("/:username", getUsersByUsername);

module.exports = userRouter;
