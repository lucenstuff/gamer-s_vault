const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const bcrypt = require("bcrypt");
const { runQuery } = require("./models/mySQL/dataBase");
const jwt = require("jsonwebtoken");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productQuery = "SELECT * FROM Products LIMIT 36;";

app.get("/getGameData", (req, res) => {
  const productQuery = "SELECT * FROM Products LIMIT 36;";

  runQuery(productQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

app.post("/addUser", (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const insertQuery = `INSERT INTO Users (Username, Password, Email, FirstName, LastName) VALUES ('${username}', '${hashedPassword}', '${email}', '${firstName}', '${lastName}')`;

      runQuery(insertQuery, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        } else {
          return res.json(results);
        }
      });
    });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const selectQuery = `SELECT * FROM Users WHERE Username = '${username}'`;
  runQuery(selectQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    bcrypt.compare(password, user.Password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign({ username: user.Username }, "DhMS2DD15S");

      res.json({ message: "Login successful", token: token });
    });
  });
});

app.get("/store", function (req, res) {
  res.sendFile(__dirname + "/public/store.html");
});

app.get("/sales", function (req, res) {
  res.sendFile(__dirname + "/public/sales.html");
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
