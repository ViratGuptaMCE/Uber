const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use('/users', userRoutes);
app.use(express.urlencoded({ extended: true }));

const connect = require('./database/db');
app.use(cors());
connect();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports  = app;