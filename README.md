# News API

## About The Project

This News API provides a REST API that enables users to search for and retrieve information on topics, articles, users, and comments from a database.

It is hosted on Render and can be viewed here: [NEWS API](https://backend-project-news-api.onrender.com/api/) 

## Prerequisites

- [PostgreSQL](https://www.postgresql.org/download/) v13.5
- [Node.js](https://nodejs.org/en/download/) v14.18.1 and above

## Installation

1. Clone this repository
```
git clone https://github.com/reemhd/News-API.git
```
2. Install the dependencies:
```
npm install
npm install pg
npm install dotenv
npm install express
```

3. To connect the two databases, you need to create two files that allow access to environment variables. These files should contain the following lines:

- .env.test --> PGDATABASE=nc_news_test
- .env.development --> PGDATABASE=nc_news

4. Seed Databases:
```
npm run setup-dbs
npm run seed
npm run seed-prod
```

5. To run tests you will need development dependencies installed:
```
npm install supertest -D
npm install jest -D
npm install jest-sorted -D
npm install pg-format -D
```

6. To run tests:
```
npm test
```

## API Endpoints

```http
GET /api
```
Responds with all the available endpoints


```http
GET /api/topics
```
Get all the topics

```http
POST /api/topics
```
Post topics


```http
GET /api/articles
```
Returns all the articles

```http
GET /api/articles/:article_id
```
Returns a specific article

```http
POST /api/articles/:article_id
```
Post a specific article

```http
PATCH /api/articles/:article_id
```
Update a specific article's votes

```http
DELETE /api/articles/:article_id
```
Deletes a specific article

```http
GET /api/articles/:article_id/comments
```
Gets all the comments for the specific article

```http
POST /api/articles/:article_id/comments
```
Post a comment for a specific article

```http
DELETE /api/comments/:comment_id
```
Deletes a comment

```http
PATCH /api/comments/:comment_id
```
Updates a comment's votes

```http
GET /api/users
```
Returns all users

```http
GET /api/users/:username
```
Returns a specific user

## Hosting

Database was set up on [ElephantSQL](https://www.elephantsql.com)

Hosted on [Render](https://render.com)
