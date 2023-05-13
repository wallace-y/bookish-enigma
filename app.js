const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router.js");
const userRouter = require("./routes/user-router.js");
const categoryRouter = require("./routes/category-router.js");
const reviewRouter = require("./routes/reviews-router.js");
const commentRouter = require("./routes/comments-router.js");

app.use(express.json());

app.use("/api", apiRouter);

// category endpoints
apiRouter.use("/categories", categoryRouter);

// users endpoints
apiRouter.use("/users", userRouter);

//review endpoints
apiRouter.use("/reviews", reviewRouter);

//comment endpoints
apiRouter.use("/comments", commentRouter);

//error handling middleware
//handling 404 errors - no available endpoint
app.use("/api/*", (req, res) => {
  res.status(404).send({ msg: "Page not found." });
});

//handling 500 errors
app.use((err, req, res, next) => {
  //handle custom errors later
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  //psql errors
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request." });
  }
  //Key (<column-name>)=(XXX) is not present in table
  if (err.code === "23503") {
    res.status(404).send({ msg: "Resource not found." });
  }
  // if the error hasn't been identified,
  // respond with an internal server error
  else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
  console.log(err)
});

module.exports = app;
