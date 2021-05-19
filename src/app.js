const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('../config/db');
const HeaderMiddleware = require('./middleware/HeaderMiddleware')

const app = express();
const Router = require('./routes/api');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
connectDB();

app.use(express.json({extended: false}));

// initialize the app verison
const APP_VERSION = process.env.APP_VERSION || 'v1';

app.use(`/api/${APP_VERSION}`,HeaderMiddleware, Router);

app.get('/', (req, res) => {res.send("API is running Nodemon")});

module.exports = app;