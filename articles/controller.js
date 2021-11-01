const { endpointWrapper } = require("../utils");
const { selectArticle } = require("./model");

exports.getArticle = endpointWrapper(async (req, res) => {
  const article = await selectArticle(req.params.article_id);
  res.status(200).send({ article });
});
