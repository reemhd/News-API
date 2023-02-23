const {
  fetchArticlesFromDB,
  fetchArticlebyIdFromDB,
  postCommentToDB,
  fetchCommentsByIdFromDB,
  updateArticlesVotesInDB,
  deleteCommentByIdInDB,
  updateCommentbyCommentId,
} = require("../models/articlesModel");

exports.fetchArticles = (req, res, next) => {
  const { topic } = req.query;
  const sortBy = req.query.sort_by || "created_at";
  const order = req.query.order || "desc";

  /* 
  topic is valid but no articles
  */
  fetchArticlesFromDB(topic, sortBy, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchArticlebyId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlebyIdFromDB(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const commentPromise = fetchCommentsByIdFromDB(article_id);
  const articleByIdPromise = fetchArticlebyIdFromDB(article_id);
  Promise.all([commentPromise, articleByIdPromise])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  postCommentToDB(article_id, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticlesVotes = (req, res, next) => {
  const { article_id } = req.params;
  const updatedVote = req.body;

  updateArticlesVotesInDB(article_id, updatedVote)
    .then((updated) => {
      res.status(200).send({ updated });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentByIdInDB(comment_id)
    .then((deleted) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateCommentbyCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const updatedVote = req.body;

  updateCommentbyCommentId(comment_id, updatedVote)
    .then((updated) => {
      res.status(200).send({ updated });
    })
    .catch((err) => {
      next(err);
    });
};
