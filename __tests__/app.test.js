const request = require('supertest')
const app = require('../app')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('task 3', () => {
    it("GET: responds with 200 and all topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            const topicsArray = body.topics
            expect(topicsArray).toHaveLength(3)
            topicsArray.forEach(topic => {
                expect(topic).toHaveProperty('slug', expect.any(String))
                expect(topic).toHaveProperty("description", expect.any(String));
            })
        })
    });

    //error handling test for wrong route?
    it("GET: responds with 404 if requests on a wrong route", () => {
      return request(app)
        .get("/api/randomtopics")
        .expect(404)
        .then((results) => {
          expect(results.statusCode).toBe(404)
        });
    });
})