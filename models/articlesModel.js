const db = require("../db/connection");
const { topicExists } = require("../util_functions/topicExists");

exports.fetchArticlesFromDB = async (topic, sortBy, order, limit, p) => {
  const parseP = parseInt(p);
  const offset = (p - 1) * limit;
  const queries = [];
  const countQueries = [];
  const validTopics = await topicExists();
  const validSorting = [
    "author",
    "title",
    "topic",
    "comment_count",
    "votes",
    "created_at",
  ];
  const validOrder = ["asc", "desc"];

  if (
    !validSorting.includes(sortBy) ||
    !validOrder.includes(order) ||
    isNaN(parseP)
  ) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  let countQueryString = `SELECT COUNT(*) FROM articles `;
  if (topic) {
    countQueryString += `WHERE articles.topic = $1`;
    countQueries.push(topic);
  }

  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (topic) {
    queryString += `WHERE articles.topic = $1`;
    queries.push(topic);
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order}`;

  if (limit) {
    queryString += ` LIMIT $${queries.length + 1}`;
    queries.push(limit);
  }

  if (offset) {
    queryString += ` OFFSET $${queries.length + 1}`;
    queries.push(offset);
  }

  const countResult = await db.query(countQueryString, countQueries);
  const totalCount = parseInt(countResult.rows[0].count);

  return db.query(queryString, queries).then((results) => {
    if (results.rowCount === 0 && !validTopics.includes(topic)) {
      return Promise.reject({ status: 404, message: "Article not found" });
    } else {
      const articles = results.rows;
      return [articles, totalCount];
    }
  });
};

exports.fetchArticlebyIdFromDB = (id) => {
  const queryString = `
    SELECT articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `;

  return db.query(queryString, [id]).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Article not found" });
    } else return results.rows[0];
  });
};

exports.fetchCommentsByIdFromDB = (id, limit, p) => {
  const queries = [id];
  const parseP = parseInt(p);
  const offset = (p - 1) * limit;

  if (isNaN(parseP)) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  let queryString = `
  SELECT comment_id, votes, created_at, author, body, article_id
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC
  `;

  if (limit) {
    queryString += ` LIMIT $${queries.length + 1}`;
    queries.push(limit);
  }

  if (offset) {
    queryString += ` OFFSET $${queries.length + 1}`;
    queries.push(offset);
  }

  return db.query(queryString, queries)
  .then((results) => results.rows);
};

exports.postCommentToDB = (article_id, comment) => {
  if (!comment.hasOwnProperty("username") || !comment.hasOwnProperty("body")) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
  const { username, body } = comment;

  const queryString = `INSERT INTO comments 
  (body, author, article_id)
  VALUES ($1, $2, $3)
  RETURNING *`;

  return db.query(queryString, [body, username, article_id])
  .then((result) => result.rows[0]);
};

exports.updateArticlesVotesInDB = (article_id, updatedVote) => {
  const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;
  return db
    .query(queryString, [updatedVote.inc_votes, article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      } else return rows[0];
    });
};

exports.postArticleToDB = (newArticle) => {
  const {
    title,
    topic,
    author,
    body,
    article_img_url = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
  } = newArticle;

  const queryString = `
  INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *
  `;
  return db
    .query(queryString, [title, topic, author, body, article_img_url])
    .then((result) => {
      return { ...result.rows[0], comment_count: 0 };
    });
};

exports.deleteArticleByIdInDB = (article_id) => {
  //additional query due to foreign key constraint
  const deleteCommentsQuery = `
  DELETE FROM comments
  WHERE article_id = $1
  `;
  const deleteArticleQuery = `
  DELETE FROM articles 
  WHERE article_id = $1 
  RETURNING *
  `;

  return db.query(deleteCommentsQuery, [article_id]).then(() => {
    return db.query(deleteArticleQuery, [article_id]).then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      } else return;
    });
  });
};
