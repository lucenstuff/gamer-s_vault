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
app.get("/api", (req, res) => {
  res.status(200).json({ message: "Welcome to the API" });
});

app.get("/api/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 10; // Results per page, default is 10
    const offset = (page - 1) * limit; // Calculation of the offset

    const productQuery = `SELECT * FROM Products LIMIT ? OFFSET ?;`;

    // Use await with runQuery within the async function
    const results = await runQuery(productQuery, [limit, offset]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productQuery = `SELECT * FROM Products WHERE ProductID = ?;`;

    const results = await runQuery(productQuery, [productId]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//User registration
app.post("/api/singup", async (req, res) => {
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

// app.post("/api/authenticate", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const selectQuery = "SELECT * FROM Users WHERE Username = ?";
//     const values = [username];

//     const results = await runQuery(selectQuery, values);

//     if (results.length === 1) {
//       const user = results[0];

//       const isMatch = await bcrypt.compare(password, user.Password);

//       if (isMatch) {
//         // Authentication successful
//         return res.json({ success: true });
//       } else {
//         // Authentication failed
//         return res
//           .status(401)
//           .json({ success: false, message: "Authentication failed" });
//       }
//     } else {
//       // No user found with the username
//       return res
//         .status(401)
//         .json({ success: false, message: "Authentication failed" });
//     }
//   } catch (error) {
//     console.error(error);
//     // Internal server error
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
