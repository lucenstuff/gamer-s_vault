const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { runQuery } = require("./public/scripts/dataBase");
const session = require("express-session");

const saltRounds = 10;

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/store", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "store.html"));
});

app.get("/sales", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sales.html"));
});

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

      const insertQuery = `INSERT INTO Users (Username, Password, Email, FirstName, LastName) VALUES (?, ?, ?, ?, ?)`;
      const values = [username, hashedPassword, email, firstName, lastName];

      runQuery(insertQuery, values, (err, results) => {
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

  const selectQuery = `SELECT * FROM Users WHERE Username = ?`;
  const values = [username];

  runQuery(selectQuery, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 1) {
      const user = results[0];

      bcrypt.compare(password, user.Password, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (isMatch) {
          req.session.username = username;
          return res.json({ success: true });
        } else {
          return res.json({ success: false });
        }
      });
    } else {
      return res.json({ success: false });
    }
  });
});

app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
