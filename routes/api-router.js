const apiRouter = require("express").Router();
const { getAllEndpoints } = require("../controllers/controllers.js");

//get all api endpoints
apiRouter.get("/", getAllEndpoints);

module.exports = apiRouter;
