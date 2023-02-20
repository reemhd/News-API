const { fetchTopicsFromDB, fetchArticlesFromDB } = require("../models/model");

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
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
};