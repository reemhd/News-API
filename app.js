const {
  handle500errors,
  handleCustomErrors,
  handle400errors,
  handle404NonExistentPath,
} = require("./controllers/errorHandlers");

const express = require("express");

const app = express();
app.use(express.json());

const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);

app.use(handle404NonExistentPath);
app.use(handle400errors);
app.use(handleCustomErrors);
app.use(handle500errors);

module.exports = app;
