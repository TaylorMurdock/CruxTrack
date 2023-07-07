const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// GET /cruxtrack/register - User Registration Page
router.get("/register", (req, res) => {
  res.render("register");
});

// POST /cruxtrack/register - User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", { error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.redirect("/cruxtrack/login");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /cruxtrack/login - User Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// POST /cruxtrack/login - User Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { error: "Invalid username or password" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render("login", { error: "Invalid username or password" });
    }

    // Set user session or token here
    // Example: req.session.user = user;

    res.redirect("/cruxtrack/myRoutes");
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST /cruxtrack/logout - User Logout
router.post("/logout", (req, res) => {
  // Clear user session or token here
  // Example: req.session.user = null;

  res.redirect("/cruxtrack/login");
});

module.exports = router;
