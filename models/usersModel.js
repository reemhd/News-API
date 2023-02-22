const db = require("../db/connection");

exports.fetchUsersFromDB = () => {
  return db
    .query(
      `
    SELECT * FROM users;
    `
    )
    .then((results) => {
      return results.rows;
    });
};
