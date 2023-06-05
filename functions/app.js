
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const path = require('path')
require('dotenv').config()
const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user');

mongoose.connect(process.env.MONGO_SECRET,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Successful MongoDB connexion !'))
  .catch((err) => console.log('Error in MongoDB connexion : ' + err));

mongoose.set('strictQuery', false);

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_URL, process.env.LOCAL4200_URL],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["sessionId", "Content-Type", "Authorization", "*"],
  exposedHeaders: ["sessionId"],
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/product', productRoutes);
app.use('/api/user', userRoutes);

module.exports = app;

