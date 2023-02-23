const endpoints = require("../endpoints.json");

exports.fetchAllEndPoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};
