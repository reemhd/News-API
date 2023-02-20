const { fetchTopicsFromDB } = require("../models/model");

exports.fetchTopics = (req, res, next) => {
  fetchTopicsFromDB()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
