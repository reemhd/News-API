const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("core tasks", () => {
  describe("task 3", () => {
    it("GET: responds with 200 and all topics", () => {
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
    //error handling test for wrong route?
    it("GET: responds with 404 if requests on a wrong route", () => {
      return request(app)
        .get("/api/randomtopics")
        .expect(404)
        .then((results) => {
          expect(results.statusCode).toBe(404);
        });
    });
  });

  describe("task 4", () => {
    it("GET: responds with 200 and all articles", () => {
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
            //do I need to change the comment_count to a number?
            expect(article).toHaveProperty("comment_count", expect.any(String));
          });
          expect(articlesArray).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
});
