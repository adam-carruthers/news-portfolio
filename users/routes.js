const { getUsers } = require("./controller");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);

module.exports = userRouter;
