const db = require("../db/connection");

exports.selectArticle = async (article_id) => {
  const {
    rows: [article],
  } = await db.query(
    `
    SELECT articles.article_id, title, articles.body, articles.votes, topic, articles.author, articles.created_at, COUNT(*)::INT AS comment_count FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id
    `,
    [article_id]
  );
  if (!article)
    throw { statusCode: 404, msg: "No article exists with that article_id" };
  return article;
};

exports.updateArticleVotes = async (article_id, inc_votes) => {
  if (typeof inc_votes !== "number" || !Number.isInteger(inc_votes)) {
    throw {
      statusCode: 400,
      msg: "inc_votes is required and must be an integer",
    };
  }
  const {
    rows: [article],
  } = await db.query(
    `
    UPDATE articles
    SET
      votes = votes + $1
    WHERE article_id=$2
    RETURNING *;
    `,
    [inc_votes, article_id]
  );
  if (!article)
    throw { statusCode: 404, msg: "No article exists with that article_id" };
  return article;
};
