const { fetchTopics, postTopic } = require("../controllers/topicsController");

const topicsRouter = require("express").Router();

topicsRouter
    .route("/")
    .get(fetchTopics)
    .post(postTopic)    

module.exports = topicsRouter;
