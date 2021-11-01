const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("404 endpoint", () => {
  test("GET /xyzk return 404", () => {
    return request(app)
      .get("/xyzk")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Route not found");
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
});
