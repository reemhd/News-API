const {
  fetchUsersFromDB,
  fetchUserByUsernameFromDB,
} = require("../models/usersModel");

exports.getAllUsers = (req, res, next) => {
  fetchUsersFromDB()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsernameFromDB(username)
  .then((user) => {
    res.status(200).send({ user });
  })
  .catch(err => {
    next(err)
  })
};
