const express = require("express");
const { getCategories } = require("./controllers/controllers.js");
const app = express();

app.use(express.json())

app.get("/api/categories",getCategories)

module.exports = app;