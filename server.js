// Import our dependencies
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

// express application
const app = express();

// middleware
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); // serve static files from public folder
app.use("/imgs", express.static(path.join(__dirname, "imgs"))); // serve static files from imgs folder
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Set the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Import the route controllers
const routeController = require("./controllers/routeController");
const userController = require("./controllers/userController");

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
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/", userController); // Mount the user routes at the "/cruxtrack" path
app.use("/mycruxtrack", ensureAuthenticated, routeController);

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
