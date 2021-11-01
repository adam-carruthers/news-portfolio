const { selectArticle } = require("../articles/model");
const db = require("../db/connection");

exports.selectArticleComments = async (article_id) => {
  await selectArticle(article_id); // 404s if article doesn't exist
  const { rows } = await db.query(
    `
    SELECT * FROM comments
    WHERE comments.article_id=$1
    `,
    [article_id]
  );
  return rows;
};

exports.insertComment = async (article_id, { username, body }) => {
  if (!body || typeof body !== "string") {
    throw {
      statusCode: 400,
      msg: "Body is required, must be a string, and must not be empty",
    };
  }
  const {
    rows: [comment],
  } = await db.query(
    `
    INSERT INTO comments
      (author, body, article_id)
    VALUES
      ($1, $2, $3)
    RETURNING *;
    `,
    [String(username), body, article_id]
  );
  return comment;
};
