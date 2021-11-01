const { endpointWrapper } = require("../utils");
const {
  selectArticleComments,
  insertComment,
  removeComment,
} = require("../comments/model");

exports.getArticleComments = endpointWrapper(async (req, res) => {
  const comments = await selectArticleComments(req.params.article_id);
  res.status(200).send({ comments });
});

exports.postArticleComment = endpointWrapper(async (req, res) => {
  try {
    const comment = await insertComment(req.params.article_id, req.body);
    res.status(200).send({ comment });
  } catch (err) {
    if (err.constraint === "comments_article_id_fkey")
      throw { statusCode: 404, msg: "No article exists with that article_id" };
    if (err.constraint === "comments_author_fkey")
      throw { statusCode: 400, msg: "Invalid or missing user" };
    throw err;
  }
});

exports.deleteComment = endpointWrapper(async (req, res) => {
  await removeComment(req.params.comment_id);
  res.sendStatus(204);
});
