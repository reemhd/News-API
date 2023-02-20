const express = require("express");
const { fetchTopics } = require("./controllers/controller");
const { handle500errors } = require("./controllers/errorHandlers");

const app = express();

app.use(express.json());

app.get("/api/topics", fetchTopics);

app.use(handle500errors);

module.exports = app;
