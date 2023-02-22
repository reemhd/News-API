const { fetchUsersFromDB } = require("../models/usersModel");

exports.getAllUsers = (req, res, next) => {
  fetchUsersFromDB()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
