const userRouter = require("express").Router();
const { getUsers } = require("../controllers/controllers.js");

//get all users
userRouter.get("/", getUsers);

module.exports = userRouter;
