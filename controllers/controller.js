const {
  fetchTopicsFromDB,
  fetchArticlesFromDB,
  fetchArticlebyIdFromDB,
  postCommentToDB,
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



















exports.postComment = (req, res, next) => {
  const { article_id } = req.params
  const comment = req.body
  postCommentToDB(article_id, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}