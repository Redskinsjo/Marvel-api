const express = require('express');
const formidable = require('express-formidable');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
app.use(formidable());
app.use(cors());

const port = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const comicsRoutes = require('./routes/comics');
app.use(comicsRoutes);
const charactersRoutes = require('./routes/characters');
app.use(charactersRoutes);
const signinRoute = require('./routes/signin');
app.use(signinRoute);
const signupRoute = require('./routes/signup');
app.use(signinRoute);

app.listen(port, () => {
  console.log('Server started on port number', port);
});
