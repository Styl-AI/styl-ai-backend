const express = require('express');
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser');
const router = require('./src/routers');
require('dotenv').config({ path: path.resolve(__dirname, 'src/.env') })
require('./src/config/db.config')
const PORT = process.env.PORT || 3100;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// This will check which api  is called on which date
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} Request to ${req.url}`);
  next(); 
});

app.get('/hello-world', (req, res) => {
    res.json({message:'Hello, World!'});
  });

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost: ${PORT}`);
});