const { endpointWrapper } = require("../utils");
const { selectArticle } = require("./model");

exports.getArticle = endpointWrapper(async (req, res) => {
  try {
    const article = await selectArticle(req.params.article_id);
    res.status(200).send({ article });
  } catch (err) {
    if (err.code === "23503")
      // Error thrown by psql if the article doesn't exist
      throw { statusCode: 404, msg: "No article with that article_id" };
    throw err;
  }
});
