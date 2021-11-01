const db = require("../connection");
const format = require("pg-format");

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  await db.query(
    `
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS articles;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS topics;

    CREATE TABLE topics (
      slug VARCHAR(255) PRIMARY KEY,
      description VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE users (
      username VARCHAR(40) PRIMARY KEY,
      avatar_url VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL
    );
        
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      votes INTEGER NOT NULL DEFAULT 0,
      topic VARCHAR(255) REFERENCES topics(slug),
      author VARCHAR(40) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(40) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      article_id INTEGER NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
      votes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      body TEXT NOT NULL
    );
    `
  );
  // 2. Add data
  await db.query(
    format(
      `
      INSERT INTO topics
        (slug, description)
      VALUES %L
      `,
      topicData.map(({ slug, description }) => [slug, description])
    )
  );
  await db.query(
    format(
      `
      INSERT INTO users
        (username, avatar_url, name)
      VALUES %L
      `,
      userData.map(({ username, avatar_url, name }) => [
        username,
        avatar_url,
        name,
      ])
    )
  );
  await db.query(
    format(
      `
      INSERT INTO articles
        (title, body, votes, topic, author, created_at)
      VALUES %L
      `,
      articleData.map(({ title, body, votes, topic, author, created_at }) => [
        title,
        body,
        votes,
        topic,
        author,
        created_at,
      ])
    )
  );
  await db.query(
    format(
      `
      INSERT INTO comments
        (author, article_id, votes, created_at, body)
      VALUES %L
      `,
      commentData.map(({ author, article_id, votes, created_at, body }) => [
        author,
        article_id,
        votes,
        created_at,
        body,
      ])
    )
  );
};

module.exports = seed;