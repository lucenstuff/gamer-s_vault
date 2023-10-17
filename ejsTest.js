const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path'); 
const { runQuery } = require('./models/mySQL/dataBase'); 

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'public','src','components','game-card'));

app.use(express.static('public')); 

const productQuery = 'SELECT * FROM Products LIMIT 36;';

app.get('/games', (req, res) => {
  runQuery(productQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.render('gameCard', { gameCard: results });
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
