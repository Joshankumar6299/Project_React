const express = require('express');
const app = express();
const connectDB = require('./database/db.js');
require('dotenv').config();
connectDB();

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});


module.exports = app;

