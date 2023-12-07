const mysql = require("mysql2");
require("dotenv").config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   port: process.env.DB_PORT,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

const pool = mysql.createPool({
  host: "aws.connect.psdb.cloud",
  user: "8fl8jvnulx12frrixg6w",
  password: "pscale_pw_p28fqQxblMERGM5m9f2K8GVu0dyLjtw7d5iPspW8nWY",
  database: "gamers_vault",
  port: "3306",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function runQuery(query, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null);
    } else {
      connection.query(query, (queryError, results) => {
        connection.release();
        callback(queryError, results);
      });
    }
  });
}

module.exports = { runQuery };
