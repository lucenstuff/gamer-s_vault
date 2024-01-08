import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Sequelize, DataTypes } from "sequelize";
import bodyParser from "body-parser";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

const ipAdress = "localhost" || "0.0.0.0";
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: `http://localhost:${port}`,
  })
);

app.use(
  cors({
    origin: "https://gamersvault.onrender.com/",
  })
);

//MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
  options: { timeout: 5000, idempotencyKey: "abc" },
});

// Step 3: Initialize the API object
const payment = new Payment(client);

// Step 4: Create the request object
const body = {
  transaction_amount: 12.34,
  description: "<DESCRIPTION>",
  payment_method_id: "<PAYMENT_METHOD_ID>",
  payer: {
    email: "<EMAIL>",
  },
};

// Step 5: Make the request
payment.create({ body }).then(console.log).catch(console.log);

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sequelize = new Sequelize({
  dialect: "mysql",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
  logging: false,
  // other options as needed
});

const User = sequelize.define(
  "Users",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Username: { type: DataTypes.STRING, allowNull: false },
    //Quizás debería hacer al usuario unique
    Password: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, unique: true, allowNull: false },
    FirstName: { type: DataTypes.STRING, allowNull: false },
    LastName: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

const Product = sequelize.define(
  "Products",
  {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ProductName: { type: DataTypes.STRING, allowNull: false },
    Description: { type: DataTypes.TEXT },
    Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    Category: { type: DataTypes.STRING, allowNull: false },
    ImageURL: { type: DataTypes.STRING },
    LicensesAvailable: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "Products",
    timestamps: false,
  }
);

const ShoppingCart = sequelize.define(
  "ShoppingCarts",
  {
    CartID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserID: { type: DataTypes.INTEGER, allowNull: false },
    CartStatus: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "ShoppingCarts",
    timestamps: false,
  }
);

const CartItem = sequelize.define(
  "CartItems",
  {
    CartItemID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CartID: { type: DataTypes.INTEGER, allowNull: false },
    ProductID: { type: DataTypes.INTEGER, allowNull: false },
    Quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "CartItems",
    timestamps: false,
  }
);

const Favorite = sequelize.define(
  "Favorites",
  {
    FavoriteID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: { type: DataTypes.INTEGER, allowNull: false },
    ProductID: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "Favorites",
    timestamps: false,
  }
);

const Promotion = sequelize.define(
  "Promotions",
  {
    PromotionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ProductID: { type: DataTypes.INTEGER, allowNull: false },
    DiscountPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    StartDate: { type: DataTypes.DATE, allowNull: false },
    EndDate: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "Promotions",
    timestamps: false,
  }
);

User.hasMany(ShoppingCart, { foreignKey: "UserID" });
ShoppingCart.belongsTo(User, { foreignKey: "UserID" });

ShoppingCart.hasMany(CartItem, { foreignKey: "CartID" });
CartItem.belongsTo(ShoppingCart, { foreignKey: "CartID" });

User.hasMany(Favorite, { foreignKey: "UserID" });
Favorite.belongsTo(User, { foreignKey: "UserID" });

Product.hasMany(Favorite, { foreignKey: "ProductID" });
Favorite.belongsTo(Product, { foreignKey: "ProductID" });

Product.hasMany(CartItem, { foreignKey: "ProductID" });
CartItem.belongsTo(Product, { foreignKey: "ProductID" });

Product.hasOne(Promotion, { foreignKey: "ProductID" });
Promotion.belongsTo(Product, { foreignKey: "ProductID" });

app.get("/api/", async (req, res) => {
  res.status(200).json({ message: "Welcome to the gamer's vault API!" });
});

app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      Username: username,
      Email: email,
      Password: hashedPassword,
      FirstName: firstName,
      LastName: lastName,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { Email: email } });

    if (!user || !(await bcrypt.compare(password, user.Password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.Email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 10; // Results per page, default is 10
    const offset = (page - 1) * limit; // Calculation of the offset

    const products = await Product.findAll({ limit, offset });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/addtocart/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity, userId } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const activeCart = await ShoppingCart.findOne({
      where: {
        UserID: userId,
        CartStatus: "active",
      },
    });

    if (activeCart) {
      await CartItem.create({
        CartID: activeCart.CartID,
        ProductID: productId,
        Quantity: quantity || 1,
      });
    } else {
      const newCart = await ShoppingCart.create({
        UserID: userId,
        CartStatus: "active",
      });

      await CartItem.create({
        CartID: newCart.CartID,
        ProductID: productId,
        Quantity: quantity || 1,
      });
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

    const activeCart = await ShoppingCart.findOne({
      where: {
        UserID: userId,
        CartStatus: "active",
      },
    });

    if (!activeCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartItems = await CartItem.findAll({
      where: { CartID: activeCart.CartID },
      include: [
        { model: Product, attributes: ["ProductID", "ProductName", "Price"] },
      ],
      attributes: ["ProductID", "Quantity"],
    });

    res.status(200).json({ cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://lucenstuff.github.io/gamer-s_vault/",
        failure: "https://lucenstuff.github.io/gamer-s_vault/",
        pending: "https://lucenstuff.github.io/gamer-s_vault/",
      },
      auto_return: "approved",
    };
    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({ id: result.id });
  } catch {
    res.status(500).json({ error: "Failed to create preference" });
  }
});

app.listen(port, ipAdress, () => {
  console.log(`Server listening on http://${ipAdress}:${port}`);
});
