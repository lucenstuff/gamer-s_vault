const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('ecommerce_test', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define the User model
const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
  },
  FirstName: {
    type: DataTypes.STRING,
  },
  LastName: {
    type: DataTypes.STRING,
  },
});

// Define the Product model
const Product = sequelize.define('Product', {
  ProductID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ProductName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ImageURL: {
    type: DataTypes.STRING(500),
  },
  LicensesAvailable: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Set up the Express app
const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define routes for handling requests
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});