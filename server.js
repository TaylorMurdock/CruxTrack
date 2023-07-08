// Import our dependencies
require("dotenv").config(); // bring in our .env vars
const express = require("express"); // web framework for node
const morgan = require("morgan"); // logger for node
const methodOverride = require("method-override"); // allows us to use PUT and DELETE methods
const mongoose = require("mongoose"); // MongoDB library
const session = require("express-session"); // session management library

// express application
const app = express();

// middleware
app.use(morgan("dev")); // logging
app.use(methodOverride("_method")); // override with POST having ?_method=DELETE or ?_method=PUT
app.use(express.static("public")); // serve static files from public folder
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

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
app.set("views", __dirname + "/views");

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

app.use("/mycruxtrack", ensureAuthenticated, routeController);
app.use("/", userController); // Mount the user routes at the "/cruxtrack" path

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
