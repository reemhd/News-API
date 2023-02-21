const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET methods", () => {
  describe("404 for valid but wrong path", () => {
    it("GET 404 if requests on a wrong route", () => {
      return request(app)
        .get("/api/randomtopics")
        .expect(404)
        .then(({body}) => {
          const error = body.message
          expect(error).toBe('Path not found')
        });
    });
  });

  describe("/api/topics", () => {
    it("GET 200: responds with all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topicsArray = body.topics;
          expect(topicsArray).toHaveLength(3);
          topicsArray.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });

  describe("/api/articles", () => {
    it("GET 200: responds with all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articlesArray = body.articles;
          articlesArray.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(String));
          });
          expect(articlesArray).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    it("GET 200: responds with specific article with given id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const articleObj = body.article;
          const expectedArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          };
          expect(articleObj).toEqual(expect.objectContaining(expectedArticle));
        });
    });
    // error handling tests
    it("GET 404: when id not in database", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
          const error = body.message;
          expect(error).toBe("Article not found");
        });
    });
    it("GET 400: when id not number", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          const error = body.message;
          expect(error).toBe("Bad request");
        });
    });
  });

  describe("/api/articles/3/comments", () => {
    it("GET 200: responds with of comments for a given article_id", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          const commentsArray = body.comments;
          const expected = [
            {
              comment_id: 11,
              votes: 0,
              created_at: "2020-09-19T23:10:00.000Z",
              author: "icellusedkars",
              body: "Ambidextrous marsupial",
              article_id: 3,
            },
            {
              comment_id: 10,
              votes: 0,
              created_at: "2020-06-20T07:24:00.000Z",
              author: "icellusedkars",
              body: "git push origin master",
              article_id: 3,
            },
          ];
          expect(commentsArray).toHaveLength(2);
          expect(commentsArray).toEqual(expected);
        });
    });
    it("GET 404: responds with message of Bad Request when given a string instead of a number", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({ body }) => {
          const error = body.message;
          expect(error).toBe("Comment not found");
        });
    });
    it("GET 400: when id not number", () => {
      return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({ body }) => {
          const error = body.message;
          expect(error).toBe("Bad request");
        });
    });
  });
});
