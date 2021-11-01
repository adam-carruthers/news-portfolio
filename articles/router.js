const { getArticle, patchArticleVotes } = require("./controller");

const articleRouter = require("express").Router();

articleRouter.get("/:article_id(\\d+)", getArticle);
articleRouter.patch("/:article_id(\\d+)", patchArticleVotes);

module.exports = articleRouter;
