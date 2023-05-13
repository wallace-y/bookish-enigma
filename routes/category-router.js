const categoryRouter = require("express").Router();
const {
  getCategories,
  postCategory,
} = require("../controllers/controllers.js");

//get all categories
categoryRouter.get("/", getCategories).post("/", postCategory);

module.exports = categoryRouter;
