const { endpointWrapper } = require("../utils");
const { selectArticle, updateArticleVotes } = require("./model");

exports.getArticle = endpointWrapper(async (req, res) => {
  const article = await selectArticle(req.params.article_id);
  res.status(200).send({ article });
});

exports.patchArticleVotes = endpointWrapper(async (req, res) => {
  const article = await updateArticleVotes(
    req.params.article_id,
    req.body.inc_votes
  );
  res.status(200).send({ article });
});
