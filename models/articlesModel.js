const db = require("../db/connection");

function topicExists() {
  return db.query(`SELECT slug FROM topics`).then((result) => {
    const topics = result.rows.map((topic) => topic.slug);
    return topics;
  });
}

exports.fetchArticlesFromDB = async (topic, sortBy, order) => {
  const queries = [];
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

  if (!validSorting.includes(sortBy) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, message: "Bad request" });
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

  return db.query(queryString, queries).then((results) => {
    if (results.rowCount === 0 && !validTopics.includes(topic)) {
      return Promise.reject({ status: 404, message: "Article not found" });
    } else return results.rows;
  });
};

exports.fetchArticlebyIdFromDB = (id) => {
  const queryString = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
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

exports.fetchCommentsByIdFromDB = (id) => {
  const queryString = `
  SELECT comment_id, votes, created_at, author, body, article_id
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;
  `;
  return db.query(queryString, [id]).then((results) => {
    return results.rows;
  });
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

  return db.query(queryString, [body, username, article_id]).then((result) => {
    return result.rows[0];
  });
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

exports.deleteCommentByIdInDB = (comment_id) => {
  const queryString = `
  DELETE FROM comments 
  WHERE comment_id = $1 
  RETURNING *
  `;
  return db.query(queryString, [comment_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, message: "Comment not found" });
    } else return;
  });
};

exports.updateCommentbyCommentId = (comment_id, updatedVote) => {
  const queryString = `
  UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;
  `;
  return db
    .query(queryString, [comment_id, updatedVote.inc_votes])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Comment not found" });
      } else return result.rows[0];
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
  `
  return db.query(queryString, [title, topic, author, body, article_img_url])
  .then(result => {
    if (!result.rows) {
      return Promise.reject({status: 404, message: 'Not found'})
    }
    else return {...result.rows[0], comment_count: 0}
  })
}