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
  return article;
};
