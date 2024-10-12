const ConnectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

ConnectToMongo();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

module.exports = app;