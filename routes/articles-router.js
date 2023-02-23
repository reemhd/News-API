const {
  fetchArticles,
  fetchArticlebyId,
  postComment,
  fetchCommentsByArticleId,
  updateArticlesVotes,
  postAnArticle,
} = require("../controllers/articlesController");

const articlesRouter = require("express").Router();

articlesRouter
.route("/")
.get(fetchArticles)
.post(postAnArticle)

articlesRouter
  .route("/:article_id")
  .get(fetchArticlebyId)
  .patch(updateArticlesVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(fetchCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
