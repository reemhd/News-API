const {
  deleteCommentById,
  updateCommentbyCommentId,
} = require("../controllers/commentsController");

const commentsRouter = require("express").Router();

commentsRouter
.route("/:comment_id")
.delete(deleteCommentById)
.patch(updateCommentbyCommentId)

module.exports = commentsRouter;
