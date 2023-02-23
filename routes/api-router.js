const { fetchAllEndPoints } = require("../controllers/endPointsController");
const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");

const apiRouter = require("express").Router();

apiRouter.get("/", fetchAllEndPoints);

apiRouter
  .use("/topics", topicsRouter)
  .use("/articles", articlesRouter)
  .use("/users", usersRouter)
  .use("/comments", commentsRouter);

module.exports = apiRouter;
