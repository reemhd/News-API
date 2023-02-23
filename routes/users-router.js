const { getAllUsers } = require("../controllers/userController");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getAllUsers);

module.exports = usersRouter;
