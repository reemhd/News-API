const {
  fetchArticlesFromDB,
  fetchArticlebyIdFromDB,
  postCommentToDB,
  fetchCommentsByIdFromDB,
  updateArticlesVotesInDB,
  deleteCommentByIdInDB,
  updateCommentbyCommentId,
  postArticleToDB,
  deleteArticleByIdInDB,
} = require("../models/articlesModel");

exports.fetchArticles = (req, res, next) => {
  const { topic, limit = 10, p = 1 } = req.query;
  const sortBy = req.query.sort_by || "created_at";
  const order = req.query.order || "desc";

  fetchArticlesFromDB(topic, sortBy, order, limit, p)
    .then((result) => {
      const [articles, totalCount] = result;
      res.status(200).send({ articles, totalCount });
    })
    .catch((err) => next(err));
};

exports.fetchArticlebyId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlebyIdFromDB(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.fetchCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const commentPromise = fetchCommentsByIdFromDB(article_id);
  const articleByIdPromise = fetchArticlebyIdFromDB(article_id);
  Promise.all([commentPromise, articleByIdPromise])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  postCommentToDB(article_id, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.updateArticlesVotes = (req, res, next) => {
  const { article_id } = req.params;
  const updatedVote = req.body;

  updateArticlesVotesInDB(article_id, updatedVote)
    .then((updated) => {
      res.status(200).send({ updated });
    })
    .catch((err) => next(err));
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentByIdInDB(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};

exports.updateCommentbyCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const updatedVote = req.body;

  updateCommentbyCommentId(comment_id, updatedVote)
    .then((updated) => {
      res.status(200).send({ updated });
    })
    .catch((err) => next(err));
};

exports.postAnArticle = (req, res, next) => {
  const newArticle = req.body;

  postArticleToDB(newArticle)
    .then((posted) => {
      res.status(201).send({ posted });
    })
    .catch((err) => next(err));
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  deleteArticleByIdInDB(article_id)
    .then(() => res.status(204).send())
    .catch((err) => next(err));
};
