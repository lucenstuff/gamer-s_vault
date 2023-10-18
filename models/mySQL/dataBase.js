const express = require("express");
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: 'containers-us-west-179.railway.app',
  user: 'root',
  password: 'L2RifKs4h3GvYKK9urFa',
  database: 'railway',
  port:'6365',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function runQuery(query, callback) {
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
