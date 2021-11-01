const express = require("express");
const articleRouter = require("./articles/router");
const commentsRouter = require("./comments/router");
const topicsRouter = require("./topics/router");

const fs = require("fs/promises");
const { endpointWrapper } = require("./utils");
const userRouter = require("./users/routes");

const app = express();

app.use(express.json());

app.get(
  "/api",
  endpointWrapper(async (req, res) => {
    const fileContents = await fs.readFile("./endpoints.json", "utf-8");
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .send(fileContents);
  })
);

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articleRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/users", userRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.statusCode) res.status(err.statusCode).send({ err: err.msg });
  else {
    console.log("Error middleware", err);
    res.status(500).send({ err: "Something went wrong" });
  }
});

module.exports = app;
