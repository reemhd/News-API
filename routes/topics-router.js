const { fetchTopics } = require("../controllers/topicsController");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(fetchTopics);

module.exports = topicsRouter;
