const express = require("express");
const {
  fetchTopics,
  fetchArticles,
  fetchArticlebyId,
} = require("./controllers/controller");
const {
  handle500errors,
  handleCustomErrors,
} = require("./controllers/errorHandlers");

const app = express();

app.use(express.json());

app.get("/api/topics", fetchTopics);

app.get("/api/articles", fetchArticles);

app.get("/api/articles/:article_id", fetchArticlebyId);

app.use(handleCustomErrors);
app.use(handle500errors);

module.exports = app;
