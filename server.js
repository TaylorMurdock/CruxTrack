// Import our dependencies
require("dotenv").config(); // Load environment variables from a .env file
const express = require("express"); // Import the Express framework
const morgan = require("morgan"); // HTTP request logger middleware
const methodOverride = require("method-override"); // Middleware for HTTP method override
const mongoose = require("mongoose"); // MongoDB object modeling tool
const session = require("express-session"); // Middleware for session management
const path = require("path"); // Utility for working with file and directory paths

// express application
const app = express(); // Create an instance of the Express application

// middleware
app.use(morgan("dev")); // Use the morgan middleware with "dev" format for logging HTTP requests
app.use(methodOverride("_method")); // Allow HTTP methods to be overridden
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" folder
app.use("/imgs", express.static(path.join(__dirname, "imgs"))); // Serve static files from the "imgs" folder
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (e.g., form data)

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret", // Set the session secret
    resave: false, // Don't save the session if unmodified
    saveUninitialized: false, // Don't create a session until something is stored
  })
);

// Set the view engine and views directory
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the "views" directory for EJS templates

// Import the route controllers
const routeController = require("./controllers/routeController"); // Import the route controller for routes starting with "/mycruxtrack"
const userController = require("./controllers/userController"); // Import the user controller for routes starting with "/"

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true, // Use the new server discovery and monitoring engine
  })
  .then(() => {
    console.log("Connected to MongoDB"); // Log a success message if connected to MongoDB
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error); // Log an error message if failed to connect to MongoDB
  });

// Routes
app.use("/", userController); // Mount the user routes at the "/cruxtrack" path
app.use("/mycruxtrack", ensureAuthenticated, routeController); // Mount the route controller at the "/mycruxtrack" path

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    // Check if the user is authenticated by checking if the user session exists
    return next(); // If authenticated, proceed to the next middleware/route handler
  }
  res.redirect("/login"); // If not authenticated, redirect to the "/login" page
}

// Listen
const PORT = process.env.PORT || 3000; // Set the port number to the environment variable PORT or 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); // Start the server and log a message with the port number it's listening on
});
