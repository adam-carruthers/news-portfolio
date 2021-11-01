const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("404 endpoint", () => {
  test("/xyzk GET return 404", () => {
    return request(app)
      .get("/xyzk")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Route not found");
      });
  });
});

describe("/api GET", () => {
  test("Returns 200 - All topics", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body["GET /api"]).toEqual({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
      });
  });
});

describe("/api/topics", () => {
  describe("/ GET", () => {
    test("Returns 200 - All topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toBeInstanceOf(Array);
          expect(topics.length).toEqual(3);
          expect(topics[0]).toEqual({
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          });
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("/api/users", () => {
  describe("/ GET", () => {
    test("Returns 200 - All users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toBeInstanceOf(Array);
          expect(users.length).toEqual(4);
          expect(users[0]).toEqual({
            username: "butter_bridge",
          });
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("/api/articles", () => {
  describe("/:article_id GET", () => {
    test("Returns 200 - Article", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 3,
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            votes: 0,
            comment_count: 2,
          });
        });
    });
    test("Returns 404 - article_id=9999 does not exist", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body: { err } }) => {
          expect(err).toEqual("No article exists with that article_id");
        });
    });
    test("Returns 404 - article_id=abcd does not exist", () => {
      return request(app).get("/api/articles/abcd").expect(404);
    });
  });

  describe("/:article_id PATCH (update votes)", () => {
    test("Returns 200 - Article with updated votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 23 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 1,
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            title: "Living in the shadow of a great man",
            topic: "mitch",
            votes: 123,
          });
        });
    });
    test("Returns 400 - inc_votes is required", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("inc_votes is required and must be an integer");
        });
    });
    test("Returns 400 - inc_votes must be a number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "abc" })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("inc_votes is required and must be an integer");
        });
    });
    test("Returns 400 - inc_votes must be an integer", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 35.35 })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("inc_votes is required and must be an integer");
        });
    });
    test("Returns 404 - article_id=9999 does not exist", () => {
      return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 23 })
        .expect(404)
        .then(({ body: { err } }) => {
          expect(err).toEqual("No article exists with that article_id");
        });
    });
    test("Returns 404 - article_id=abcd does not exist", () => {
      return request(app)
        .patch("/api/articles/abcd")
        .send({ inc_votes: 23 })
        .expect(404);
    });
  });

  describe("/ GET", () => {
    test("Returns 200 - All articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toEqual(12);
          articles.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
          expect(
            articles.map(({ created_at }) => Date.parse(created_at).valueOf())
          ).toBeSorted({ descending: true });
        });
    });
    test("Returns 200 - All articles ascending", () => {
      return request(app)
        .get("/api/articles")
        .query({ order: "asc" })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toEqual(12);
          expect(
            articles.map(({ created_at }) => Date.parse(created_at).valueOf())
          ).toBeSorted({ descending: false });
        });
    });
    test("Returns 200 - All articles sorted by title", () => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: "title" })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toEqual(12);
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });
    test("Returns 200 - All articles sorted by comment_count ascending", () => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: "comment_count", order: "asc" })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toEqual(12);
          expect(articles).toBeSortedBy("comment_count", { descending: false });
        });
    });
    test("Returns 200 - All articles filtered by topic", () => {
      return request(app)
        .get("/api/articles")
        .query({ topic: "mitch" })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toEqual(11);
          articles.forEach(({ topic }) => {
            expect(topic).toEqual("mitch");
          });
        });
    });
    test("Returns 200 - No articles with weird topic", () => {
      return request(app)
        .get("/api/articles")
        .query({ topic: { a: 5 } })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toEqual(0);
        });
    });
    test("Returns 200 - All mitch articles sorted by votes ascending", () => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: "comment_count", order: "asc", topic: "mitch" })
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toEqual(11);
          expect(articles).toBeSortedBy("comment_count", { descending: false });
          articles.forEach((article) => {
            expect(article.topic).toEqual("mitch");
          });
        });
    });
    test("Returns 400 - Invalid sort_by", () => {
      return request(app)
        .get("/api/articles")
        .query({ sort_by: "defo not a key" })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("Invalid sort_by query");
        });
    });
    test("Returns 400 - Invalid order", () => {
      return request(app)
        .get("/api/articles")
        .query({ order: true })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("Invalid order query");
        });
    });
  });

  describe("/:article_id/comments GET", () => {
    test("Returns 200 - Article comments", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toEqual(2);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("Returns 200 - Article has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toEqual(0);
        });
    });
    test("Returns 404 - Article does not exist", () => {
      return request(app)
        .get("/api/articles/9876/comments")
        .expect(404)
        .then(({ body: { err } }) => {
          expect(err).toEqual("No article exists with that article_id");
        });
    });
    test("Returns 404 - Article does not exist weird article_id", () => {
      return request(app).get("/api/articles/094a/comments").expect(404);
    });
  });

  describe("/:article_id/comments POST", () => {
    test("Returns 200 - new comment posted", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          username: "lurker",
          body: "jk lurkers don't write comments",
        })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 5,
              author: "lurker",
              body: "jk lurkers don't write comments",
              comment_id: 19,
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
    test("Returns 200 - new comment posted ignores other items", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          username: "lurker",
          body: "jk lurkers don't write comments",
          ignore_me: "hi",
          created_at: "some fake time",
        })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 5,
              author: "lurker",
              body: "jk lurkers don't write comments",
              comment_id: 19,
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
    test("Returns 400 - user doesn't exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "goodyguts",
          body: "insightful comment",
        })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("Invalid or missing user");
        });
    });
    test("Returns 400 - invalid user", () => {
      return request(app)
        .post("/api/articles/4/comments")
        .send({
          username: 1234,
          body: "insightful comment",
        })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual("Invalid or missing user");
        });
    });
    test("Returns 400 - missing body", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          username: "icellusedkars",
        })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual(
            "Body is required, must be a string, and must not be empty"
          );
        });
    });
    test("Returns 400 - empty body", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          username: "icellusedkars",
          body: "",
        })
        .expect(400)
        .then(({ body: { err } }) => {
          expect(err).toEqual(
            "Body is required, must be a string, and must not be empty"
          );
        });
    });
    test("Returns 404 - Article does not exist", () => {
      return request(app)
        .post("/api/articles/9876/comments")
        .send({
          username: "lurker",
          body: "jk lurkers don't write comments",
        })
        .expect(404)
        .then(({ body: { err } }) => {
          expect(err).toEqual("No article exists with that article_id");
        });
    });
    test("Returns 404 - Article does not exist weird article_id", () => {
      return request(app).post("/api/articles/094a/comments").expect(404);
    });
  });
});

describe("/api/comments", () => {
  describe("/:comment_id DELETE", () => {
    test("204 - Deletes comment", () => {
      return request(app)
        .delete("/api/comments/16")
        .expect(204)
        .then(() => request(app).get("/api/articles/6/comments").expect(200))
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]); // Checks deleted from article comments
        });
    });
    test("404 - Invalid comment id", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body: { err } }) => {
          expect(err).toEqual("No comment exists with that comment_id");
        });
    });
    test("404 - Invalid and weird comment id", () => {
      return request(app).delete("/api/comments/abcd").expect(404);
    });
  });
});
