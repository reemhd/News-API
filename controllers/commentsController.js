const {
  deleteCommentByIdInDB,
  updateCommentbyCommentId,
} = require("../models/commentsModel");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentByIdInDB(comment_id)
    .then(() => res.status(204).send())
    .catch((err) => next(err));
};

exports.updateCommentbyCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const updatedVote = req.body;

  updateCommentbyCommentId(comment_id, updatedVote)
    .then((updated) => res.status(200).send({ updated }))
    .catch((err) => next(err));
};