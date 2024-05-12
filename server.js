// Importing necessary modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./src/routers'); // Assuming this file exports the router
require('dotenv').config({ path: path.resolve(__dirname, 'src/.env') });
require('./src/config/db.config');

// Setting up the default port
const PORT = process.env.PORT || 3100;

// Creating an Express application
const app = express();

// Adding middleware for CORS
app.use(cors());

// Adding middleware for parsing JSON bodies
app.use(bodyParser.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} Request to ${req.url}`);
  next(); 
});

// Route for a simple hello world message
app.get('/hello-world', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Mounting the router under '/api' prefix
app.use("/api", router);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
