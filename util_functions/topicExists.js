const db = require("../db/connection");

exports.topicExists = () => {
  return db.query(`SELECT slug FROM topics`).then((result) => {
    const topics = result.rows.map((topic) => topic.slug);
    return topics;
  });
};
