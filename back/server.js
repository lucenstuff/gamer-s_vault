const express = require("express");
const bcrypt = require("bcrypt");
const { runQuery } = require("./middleware/dbconnection");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

app.use(express.json());

// API routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});

// Get product data
app.get("/api/products", (req, res) => {
  const page = req.query.page || 1; // Página actual, el valor predeterminado es 1
  const limit = req.query.limit || 10; // Cantidad de resultados por página, el valor predeterminado es 10
  const offset = (page - 1) * limit; // Cálculo del desplazamiento (offset)

  //http://localhost:8080/api/products?page=1&limit=10

  const productQuery = `SELECT * FROM Products LIMIT ${limit} OFFSET ${offset};`;

  runQuery(productQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const productQuery = `SELECT * FROM Products WHERE ProductID = ${productId};`;

  runQuery(productQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(results[0]);
  });
});

// User registration
app.post("/api/users", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery =
      "INSERT INTO Users (Username, Password, Email, FirstName, LastName) VALUES (?, ?, ?, ?, ?)";
    const values = [username, hashedPassword, email, firstName, lastName];

    await runQuery(insertQuery, values);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login (consider using a more RESTful endpoint like /api/authenticate)
app.post("/api/authenticate", async (req, res) => {
  try {
    const { username, password } = req.body;

    const selectQuery = "SELECT * FROM Users WHERE Username = ?";
    const values = [username];

    const results = await runQuery(selectQuery, values);

    if (results.length === 1) {
      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.Password);

      if (isMatch) {
        return res.json({ success: true });
      } else {
        return res.json({ success: false });
      }
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
