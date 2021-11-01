const express = require("express");
const articleRouter = require("./articles/router");
const topicsRouter = require("./topics/router");

const app = express();

app.use(express.json());

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articleRouter);

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
