const {
  fetchArticles,
  fetchArticlebyId,
  postComment,
  fetchCommentsByArticleId,
  updateArticlesVotes,
} = require("../controllers/articlesController");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(fetchArticles);

articlesRouter
  .route("/:article_id")
  .get(fetchArticlebyId)
  .patch(updateArticlesVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(fetchCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
