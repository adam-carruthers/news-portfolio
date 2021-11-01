const { getArticle } = require("./controller");

const articleRouter = require("express").Router();

articleRouter.get("/:article_id(\\d+)", getArticle);

module.exports = articleRouter;
