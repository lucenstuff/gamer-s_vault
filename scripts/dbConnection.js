const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'DESKTOP-PD3G8T4',
    user: 'admin',
    password: 'password',
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
