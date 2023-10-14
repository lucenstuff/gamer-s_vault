let mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'ecommerce_test'
})

connection.connect((error) => {
    if(error){
        console.log('Error connecting to the database')
        return;
    }
    console.log('Successfully connected to the database.');
    
    connection.end((error) => {
        if (error) {
            console.log('Error closing the database connection');
            return;
        }
        console.log('Closed the database connection')
    })
})
