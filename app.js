const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const { runQuery } = require("./models/mySQL/dataBase");

app.set("view engine", "ejs");
app.set(
  "views",
  path.join(__dirname, "public", "src", "components", "game-card")
);

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

  const insertQuery = `INSERT INTO Users (Username, Password, Email, FirstName, LastName) VALUES ('${username}', '${password}', '${email}', '${firstName}', '${lastName}')`;

  runQuery(insertQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
