const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'ecommerce_test'
});

connection.connect((error) => {
  if (error) {
    console.log('Error connecting to the database');
    return;
  }
  console.log('Successfully connected to the database.');

});



const users = "SELECT * FROM Products";  

connection.query(users, (error, results) => {
  if (error) {
    console.log('Error executing query:', error);
    return;
  }
  console.log(results);
})

connection.end();