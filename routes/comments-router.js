const {
  deleteCommentById,
  updateCommentbyCommentId,
} = require("../controllers/articlesController");

const commentsRouter = require("express").Router();

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)
.patch(updateCommentbyCommentId)

module.exports = commentsRouter;
