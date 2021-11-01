const db = require("../db/connection");

exports.selectArticles = async ({ sort_by, order, topic } = {}) => {
  sort_by = sort_by || "created_at";
  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  )
    throw { statusCode: 400, msg: "Invalid sort_by query" };

  order = order || "desc";
  if (!["asc", "desc"].includes(order))
    throw { statusCode: 400, msg: "Invalid order query" };

  let queryStr = `
    SELECT articles.*, COUNT(*)::INT AS comment_count FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    ${topic ? "WHERE topic=$1" : ""}
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
  `;
  const queryParams = topic ? [String(topic)] : [];

  const { rows } = await db.query(queryStr, queryParams);
  return rows;
};

exports.selectArticle = async (article_id) => {
  const {
    rows: [article],
  } = await db.query(
    `
    SELECT articles.*, COUNT(*)::INT AS comment_count FROM articles
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

exports.selectArticleComments = async (article_id) => {
  await exports.selectArticle(article_id); // 404s if article doesn't exist
  const { rows } = await db.query(
    `
    SELECT * FROM comments
    WHERE comments.article_id=$1
    `,
    [article_id]
  );
  return rows;
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
