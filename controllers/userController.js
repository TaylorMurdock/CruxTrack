const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Route = require("../models/route");

// GET /cruxtrack/register - User Registration Page
router.get("/register", (req, res) => {
  res.render("register", { error: req.query.error || null });
});

// POST /cruxtrack/register - User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.redirect("/cruxtrack/register?error=Username already exists");
    }

    // Create a new user
    const newUser = new User({
      username,
      password,
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
  res.render("login", { error: req.query.error || null });
});

// POST /cruxtrack/login - User Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.redirect(
        "/cruxtrack/login?error=Invalid username or password"
      );
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.redirect(
        "/cruxtrack/login?error=Invalid username or password"
      );
    }

    // Set user session or token here
    req.session.user = user._id;

    res.redirect("/mycruxtrack/myroutes");
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST /cruxtrack/logout - User Logout
router.post("/logout", (req, res) => {
  // Clear user session or token here
  req.session.user = null;

  res.redirect("/cruxtrack/login");
});

// POST /cruxtrack/deleteaccount - Delete User Account
router.post("/deleteaccount", async (req, res) => {
  try {
    // Add authentication mechanism here to ensure user confirmation or verification

    // Delete the user account and associated routes
    const userId = req.session.user;
    await User.findByIdAndDelete(userId);
    await Route.deleteMany({ user: userId });

    // Clear the session or token after deleting the account
    req.session.user = null;

    res.redirect("/cruxtrack/register"); // Redirect to registration page or any other desired page
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
