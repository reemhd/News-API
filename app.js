const express = require("express");
const { fetchTopics } = require("./controllers/topicsController");
const {
  fetchArticles,
  fetchArticlebyId,
  postComment,
  fetchCommentsByArticleId,
  updateArticlesVotes,
} = require("./controllers/articlesController");
const { getAllUsers } = require("./controllers/userController");
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
  .post("/api/articles/:article_id/comments", postComment)
  .patch("/api/articles/:article_id", updateArticlesVotes)
  .get("/api/users", getAllUsers);

app.use(handle404NonExistentPath);
app.use(handle400errors);
app.use(handleCustomErrors);
app.use(handle500errors);

module.exports = app;
