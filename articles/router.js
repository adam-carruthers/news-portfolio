const { getArticle, patchArticleVotes, getArticles } = require("./controller");

const articleRouter = require("express").Router();

articleRouter.get("/", getArticles);
articleRouter.get("/:article_id(\\d+)", getArticle);
articleRouter.patch("/:article_id(\\d+)", patchArticleVotes);

module.exports = articleRouter;
