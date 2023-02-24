const { fetchTopicsFromDB, postTopicToDB } = require("../models/topicsModel");

exports.fetchTopics = (req, res, next) => {
  fetchTopicsFromDB()
    .then((topics) => res.status(200).send({ topics }))
    .catch((err) => next(err));
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;
  postTopicToDB(newTopic)
    .then((posted) => res.status(201).send({ posted }))
    .catch((err) => next(err));
}
