const db = require("../db/connection");

exports.fetchTopicsFromDB = () => {
  return db
    .query(
      `
    SELECT * FROM topics;
    `
    )
    .then((results) => {
      return results.rows;
    });
};

exports.fetchArticlesFromDB = () => {
  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  
  return db.query(queryString).then((results) => {
    return results.rows;
  });
};
