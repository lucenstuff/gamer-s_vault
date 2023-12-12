const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  // ssl: {
  //   rejectUnauthorized: true,
  // },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function runQuery(query, values = []) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(query, values, (queryError, results) => {
          connection.release();

          if (queryError) {
            reject(queryError);
          } else {
            resolve(results);
          }
        });
      }
    });
  });
}

module.exports = { runQuery };
