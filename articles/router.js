const {
  getArticle,
  patchArticleVotes,
  getArticles,
  getArticleComments,
} = require("./controller");

const articleRouter = require("express").Router();

articleRouter.get("/", getArticles);
articleRouter.get("/:article_id(\\d+)", getArticle);
articleRouter.patch("/:article_id(\\d+)", patchArticleVotes);
articleRouter.get("/:article_id(\\d+)/comments", getArticleComments);

module.exports = articleRouter;
