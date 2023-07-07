// Import our dependencies
require("dotenv").config(); // bring in our .env vars
const express = require("express"); // web framework for node
const morgan = require("morgan"); // logger for node
const methodOverride = require("method-override"); // allows us to use PUT and DELETE methods
const mongoose = require("mongoose"); // MongoDB library

// express application
const app = express();

// middleware
app.use(morgan("dev")); // logging
app.use(methodOverride("_method")); // override with POST having ?_method=DELETE or ?_method=PUT
app.use(express.static("public")); // serve static files from public folder

// Set the view engine and views directory
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Import the route controller
const routeController = require("./controllers/routeController");

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/cruxtrack", routeController);

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
