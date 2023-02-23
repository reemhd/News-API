const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const endpointsJson = require('../endpoints.json')

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("Articles", () => {
  // wrong path
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

  // topics
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
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "11",
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
  // post
  describe("POST method for articles", () => {
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
              .then(({ body }) => {
                expect(body.comments).toHaveLength(1);
              });
          });
      });
      //error handling for post comments
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
            expect(body.message).toBe("Article not found");
          });
      });
      it("400 status code if article id not a number", () => {
        return request(app)
          .post("/api/articles/banana/comments")
          .send({ username: "butter_bridge", body: "Anything" })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Bad request");
          });
      });
    });
  });

  describe("PATCH method for articles", () => {
    describe("/api/articles/:article_id", () => {
      it("200 response with an increase of votes in article by id", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 2 })
          .expect(200)
          .then(({ body }) => {
            const updatedArticle = body.updated;
            expect(updatedArticle.votes).toBe(102);
          });
      });
      it("200 response with a decrease of votes in article by id", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -2 })
          .expect(200)
          .then(({ body }) => {
            const updatedArticle = body.updated;
            expect(updatedArticle.votes).toBe(98);
          });
      });
      // error handling for patch articles
      it("404 status code if article not found", () => {
        return request(app)
          .patch("/api/articles/999")
          .send({ inc_votes: -2 })
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("Article not found");
          });
      });
      it("400 status code if article id not a number", () => {
        return request(app)
          .patch("/api/articles/banana")
          .send({ inc_votes: 22 })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Bad request");
          });
      });
      it("400 status code if invalid object sent", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Invalid request");
          });
      });
    });
  });

  describe("Get articles by queries", () => {
    it("GET 200: returns articles filtered by topic value", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          // only one in test db
          expect(body.articles).toHaveLength(1);
        });
    });
    it("GET 200: returns articles filtered by topic value", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(11);
        });
    });
    // sorting by author, title, topic, comment count, votes, created_at
    it("GET 200: returns articles sorted by valid sorting options: author ASC", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("author", { ascending: true });
        });
    });
    it("GET 200: returns articles sorted by valid sorting options: Mitch comment_count desc", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=comment_count")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("comment_count", {
            coerce: true,
            descending: true,
          });
        });
    });
    it("GET 200: valid topic (paper) but no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toHaveLength(0);
        });
    });
    // tests for errors sort_by and order
    it("GET 400: if invalid sort_by ", () => {
      return request(app)
        .get("/api/articles?sort_by=author_age")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
    it("GET 400: if invalid order ", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=blackhole")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
    it("GET 404: if article do not exist", () => {
      return request(app)
        .get("/api/articles?topic=monkeys")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Article not found");
        });
    });
  });
  
  describe("DELETE comment", () => {
    it("204 response status code and deleted comment by comment_id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return db
            .query(`SELECT * FROM comments WHERE comment_id = 1`)
            .then((results) => {
              expect(results.rows).toHaveLength(0);
            });
        });
    });
    //error tests
    it("404 response status code when comment_id non-existent", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Comment not found");
        });
    });
    it("400 response status code when comment_id not valid", () => {
      return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });

  describe("All endpoints", () => {
    it("GET 200: all endpoints on /api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const endpoints = body.endpoints
          expect(endpoints).toEqual(endpointsJson)
          });
  });
});

// get users
describe("Users", () => {
  it("GET 200: responds with array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const userArray = body.users;
        expect(userArray).toHaveLength(4);
        userArray.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});
