const express = require("express");
const {
  fetchTopics,
  fetchArticles,
  fetchArticlebyId,
  fetchCommentsByArticleId,
} = require("./controllers/controller");
const {
  handle500errors,
  handleCustomErrors,
  handle400errors,
  handle404NonExistentPath,
} = require("./controllers/errorHandlers");

const app = express();

app.use(express.json());

app
.get("/api/topics", fetchTopics)
.get("/api/articles", fetchArticles)
.get("/api/articles/:article_id", fetchArticlebyId)
.get("/api/articles/:article_id/comments", fetchCommentsByArticleId)

app.use(handle404NonExistentPath)
app.use(handle400errors);
app.use(handleCustomErrors);
app.use(handle500errors);

module.exports = app;
