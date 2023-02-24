const db = require("../db/connection");

exports.fetchTopicsFromDB = () => {
  return db.query(`SELECT * FROM topics;`).then((results) => results.rows);
};

exports.postTopicToDB = (newTopic) => {
  const { slug, description } = newTopic;

  const queryString = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`
  return db.query(queryString, [slug, description])
  .then(result => result.rows[0])
};
