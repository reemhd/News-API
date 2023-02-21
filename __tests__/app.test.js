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
        .then(({ body }) => {
          const error = body.message;
          expect(error).toBe("Path not found");
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

    it("GET 200: when id is in database but no comments for that id", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(0);
        });
    });

    it("GET 404: responds with message of not found when valid id but not in database", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({ body }) => {
          const error = body.message;
          expect(error).toBe("Article not found");
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

describe("POST method", () => {
  describe("/api/articles/:article_id/comments", () => {
    it("POST 201: responds with posted comment", () => {
      return request(app)
        .post("/api/articles/4/comments")
        .send({
          username: "butter_bridge",
          body: "Anything",
        })
        .expect(201)
        .then(({ body }) => {
          const comment = body.comment;
          const expectedComment = {
            comment_id: 19,
            body: "Anything",
            article_id: 4,
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
          };
          expect(comment).toMatchObject(expectedComment);
          // also checking the database to see if comment has been added
          return request(app)
          .get(`/api/articles/4/comments`)
          .expect(200)
          .then(({body}) => {
            expect(body.comments).toHaveLength(1)
          })
        })
    });
    //error handling
    it("400 status code if the request body is missing any required fields, such as username or body", () => {
      return request(app)
        .post("/api/articles/8/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
    it("404 status code if article not found", () => {
      return request(app)
        .post("/api/articles/999/comments")
        .send({ username: "butter_bridge", body: "Anything" })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe('Article not found')
        });
    });
  });
});
