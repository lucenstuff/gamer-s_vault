const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'ecommerce_test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

function getProducts(callback){
  pool.query('SELECT * FROM Products', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    callback(results);
  })
}

function addProduct(productData, callback) {
  const { productName, description, price, category, imageURL, licensesAvailable } = productData;
  pool.query(
    'INSERT INTO Products (ProductName, Description, Price, Category, ImageURL, LicensesAvailable) VALUES (?, ?, ?, ?, ?, ?)',
    [productName, description, price, category, imageURL, licensesAvailable],
    (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, 'Product added successfully');
      }
    }
  );
}

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

  connection.release();
});

module.exports ={ getProducts, addProduct };
