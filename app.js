const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const functions = require('firebase-functions');
const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const path = require('path')
require('dotenv').config()

const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user');

mongoose.connect(process.env.MONGO_SECRET,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["sessionId", "Content-Type", "Authorization", "*"],
  exposedHeaders: ["sessionId"],
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


app.get('/', (req, res) => {
  res.send('Hello from Firebase!');
});

app.use('/api/product', productRoutes);
app.use('/api/user', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;