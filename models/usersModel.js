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

exports.fetchUserByUsernameFromDB = (username) => {
  return db
    .query(
      `
    SELECT * FROM users
    WHERE username = $1
    `,
      [username]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "User not found" });
      }
      else return result.rows[0];
    });
};
