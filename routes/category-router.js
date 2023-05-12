const categoryRouter = require("express").Router();
const { getCategories } = require("../controllers/controllers.js");

//get all categories
categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
