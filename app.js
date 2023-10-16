const path = require('path');
const express = require('express');
const mySqlConnection = require('./models/mySQL/dataBase');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});