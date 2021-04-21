const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(formidable());
app.use(cors());

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);
const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);
const creatorsRoutes = require("./routes/creators.js");
app.use(creatorsRoutes);
const eventsRoutes = require("./routes/events.js");
app.use(eventsRoutes);
const storiesRoutes = require("./routes/stories.js");
app.use(storiesRoutes);
const seriesRoutes = require("./routes/series.js");
app.use(seriesRoutes);
const userRoutes = require("./routes/user.js");
app.use(userRoutes);

app.listen(PORT, () => {
  console.log("Server started on port number", PORT);
});
