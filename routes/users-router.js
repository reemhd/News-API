const { getAllUsers } = require("../controllers/userController");
const { fetchUserByUsername } = require("../controllers/userController");

const usersRouter = require("express").Router();

usersRouter
    .route("/")
    .get(getAllUsers);

usersRouter
    .route("/:username")
    .get(fetchUserByUsername);

module.exports = usersRouter;
