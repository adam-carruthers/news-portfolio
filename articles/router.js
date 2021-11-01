const {
  getArticleComments,
  postArticleComment,
} = require("../comments/controller");
const { getArticle, patchArticleVotes, getArticles } = require("./controller");

const articleRouter = require("express").Router();

articleRouter.get("/", getArticles);
articleRouter.get("/:article_id(\\d+)", getArticle);
articleRouter.patch("/:article_id(\\d+)", patchArticleVotes);
articleRouter.get("/:article_id(\\d+)/comments", getArticleComments);
articleRouter.post("/:article_id(\\d+)/comments", postArticleComment);

module.exports = articleRouter;
