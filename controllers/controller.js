const {
  fetchTopicsFromDB,
  fetchArticlesFromDB,
  fetchArticlebyIdFromDB,
  fetchCommentsByIdFromDB,
  selectCommentsByIdFromDB
} = require("../models/model");

exports.fetchTopics = (req, res, next) => {
  fetchTopicsFromDB()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchArticles = (req, res, next) => {
  fetchArticlesFromDB()
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
  const promise1 = fetchCommentsByIdFromDB(article_id);
  const promise2 = fetchArticlebyIdFromDB(article_id);
  Promise.all([promise1, promise2])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
