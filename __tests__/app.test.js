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

  describe("task 5", () => {
    it("GET: responds with 200 and specific article with given id", () => {
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
    it("GET: responds with 404 and when id not present", () => {
        return request(app)
        .get('/api/articles/99999')
        .expect(404)
        .then(({body}) => {
            const error = body.message
            expect(error).toBe('Article not found')
        })
    });
    it("GET: responds with 400 and when id not number", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          const error = body.message
          expect(error).toBe('Bad request')
        });
    });
  });
});































































describe('POST method', () => {
  describe("/api/articles/:article_id/comments", () => {
    it("POST 201: responds with posted comment", () => {
      return request(app)
        .post("/api/articles/4/comments")
        .send({
          username: "butter_bridge",
          body: "Anything",
        })
        .expect(201)
        .then(({body}) => {
          const comment = body.comment
          const expectedComment = []
        })
    });
  });
})