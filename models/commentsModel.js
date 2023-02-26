const db = require("../db/connection");

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
