# News API

## Information

This News API uses REST API which allows users to search and retrieve topics, articles, users and comments.

The API is hosted on Render: [NEWS API](https://backend-project-news-api.onrender.com/api/) 

## Prerequisites

- [PostgreSQL](https://www.postgresql.org/download/) v13.5
- [Node.js](https://nodejs.org/en/download/) v14.18.1 and above

## Installation

1. Clone this repository
```
git clone <repo url>
```

2. Then, `cd` into the API directory 

3. Install the dependencies:
```
npm install pg;
npm install dotenv;
npm install express;
```

4. To connect the two databases, you need to create two files that allow access to environment variables: ".env.test" and ".env.development". These files should contain the following lines:

- .env.test -->> PGDATABASE=nc_news_test
- .env.development -->> PGDATABASE=nc_news

5. Seed Databases:
```
npm run setup-dbs;
npm run seed;
```

6. To run tests you will need development dependencies installed:
```
npm install supertest -D;
npm install jest -D;
npm install jest-sorted -D;
npm install pg-format -D;
```

7. To run tests:
```
npm test
```

## API Endpoints

```http
GET /api
```
Serves all the available endpoints


```http
GET /api/topics
```
Get all the topics


```http
GET /api/articles
```
Returns all the articles


```http
GET /api/articles/:article_id
```
Get an specific article


```http
GET /api/articles/:article_id/comments
```
Get all the comments for a specific article


```http
POST /api/articles/:article_id/comments
```
Add a new comment to an article. This route requires a JSON body with body and created_by key value pairs
e.g: `{"username": <username>, "body": "This is a new comment",}`


```http
DELETE /api/comments/:comment_id
```
Deletes a comment


```http
GET /api/users
```
Returns all users

## Hosting

Ensure you have set up your database on [ElephantSQL](https://www.elephantsql.com).

Then host your API using [Render](https://render.com).