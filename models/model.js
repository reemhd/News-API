const db = require("../db/connection");

exports.fetchTopicsFromDB = () => {
    return db.query(`
    SELECT * FROM topics;
    `).then(results => {
        return results.rows;
    })
};
