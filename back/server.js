const express = require("express");
const { runQuery } = require("./middleware/dbconnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

const bycrypt = require("bcrypt");
const saltRound = 10;

bycrypt.hash("password", saltRound, function (err, hash) {});

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

app.post("/api/addtocart/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity, userId } = req.body;

    const productQuery = "SELECT * FROM Products WHERE ProductID = ?";
    const product = await runQuery(productQuery, [productId]);

    if (!product || product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const activeCartQuery =
      "SELECT * FROM ShoppingCarts WHERE UserID = ? AND CartStatus = 'active'";
    const activeCart = await runQuery(activeCartQuery, [userId]);

    if (activeCart && activeCart.length > 0) {
      const updateCartQuery =
        "INSERT INTO CartItems (CartID, ProductID, Quantity) VALUES (?, ?, ?)";
      const updateCartValues = [activeCart[0].CartID, productId, quantity || 1];
      await runQuery(updateCartQuery, updateCartValues);
    } else {
      const createCartQuery =
        "INSERT INTO ShoppingCarts (UserID, CartStatus) VALUES (?, 'active')";
      const createCartValues = [userId];
      const result = await runQuery(createCartQuery, createCartValues);

      const newCartId = result.insertId;
      const addToCartQuery =
        "INSERT INTO CartItems (CartID, ProductID, Quantity) VALUES (?, ?, ?)";
      const addToCartValues = [newCartId, productId, quantity || 1];
      await runQuery(addToCartQuery, addToCartValues);
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/getcart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const activeCartQuery =
      "SELECT * FROM ShoppingCarts WHERE UserID = ? AND CartStatus = 'active'";
    const activeCart = await runQuery(activeCartQuery, [userId]);

    if (!activeCart || activeCart.length === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const cartItemsQuery = `
      SELECT CI.ProductID, CI.Quantity, P.ProductName, P.Price
      FROM CartItems CI
      INNER JOIN Products P ON CI.ProductID = P.ProductID
      WHERE CI.CartID = ?
    `;
    const cartItems = await runQuery(cartItemsQuery, [activeCart[0].CartID]);

    res.status(200).json({ cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//User registration
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const salt = await bcrypt.genSalt();
    const Password = await bcrypt.hash(password, salt);

    const insertQuery =
      "INSERT INTO Users (Username, Password, Email, FirstName, LastName) VALUES (?, ?, ?, ?, ?)";
    const values = [username, Password, email, firstName, lastName];

    await runQuery(insertQuery, values);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    //NEED TO HANDLE EXISTING USER
  }
});

//user authentication

app.post("/api/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userQuery = "SELECT * FROM Users WHERE Email = ?;";
    const user = await runQuery(userQuery, [email]);

    if (!user || user.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user[0].Password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user[0].UserID, email: user[0].Email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expiration time
      }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
