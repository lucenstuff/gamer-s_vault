const express = require('express');
const mysql = require('mysql2');


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'ecommerce_test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

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

module.exports ={ runQuery };
