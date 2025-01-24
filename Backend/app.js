const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/users', userRoutes);
app.use(express.urlencoded({ extended: true }));

const connect = require('./database/db');
connect();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports  = app;