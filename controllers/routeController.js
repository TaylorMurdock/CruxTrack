const express = require("express");
const router = express.Router();
const Route = require("../models/route");
const User = require("../models/user");

// GET /mycruxtrack/myroutes - List of Routes
router.get("/myroutes", async (req, res) => {
  try {
    const userId = req.session.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const routes = await Route.find({ user: userId });
    res.render("myroutes", { routes, user });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /mycruxtrack/route/:id - Specific Route Details
router.get("/route/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).send("Route not found");
    }

    const userId = req.session.user;
    const user = await User.findById(userId);

    res.render("routedetails", { route, user });
  } catch (error) {
    console.error("Error fetching route details:", error);
    res.status(500).send("Internal Server Error");
  }
});
// GET /mycruxtrack/route/:id/edit - Edit Route Page
router.get("/route/:id/edit", async (req, res) => {
  try {
    const routeId = req.params.id;
    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).send("Route not found");
    }

    const userId = req.session.user;
    const user = await User.findById(userId);

    res.render("editRoute", { route, user });
  } catch (error) {
    console.error("Error fetching route details:", error);
    res.status(500).send("Internal Server Error");
  }
});
// POST /mycruxtrack/route/:id - Update Route
router.post("/route/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    const { name, difficulty, type, location, ticks } = req.body;

    const updatedRoute = await Route.findByIdAndUpdate(
      routeId,
      { name, difficulty, type, location, ticks },
      { new: true }
    );

    if (!updatedRoute) {
      return res.status(404).send("Route not found");
    }

    res.redirect("/mycruxtrack/myroutes");
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE /mycruxtrack/route/:id - Delete Route
router.delete("/route/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    await Route.findByIdAndDelete(routeId);
    res.redirect("/mycruxtrack/myroutes");
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /mycruxtrack/newroute - Add New Route Page
router.get("/newroute", async (req, res) => {
  const userId = req.session.user;
  const user = await User.findById(userId);

  res.render("newRoute", { user });
});

// POST /mycruxtrack/newroute - Create a New Route
router.post("/newroute", async (req, res) => {
  try {
    const { name, difficulty, type, location, ticks } = req.body;
    const userId = req.session.user;
    const newRoute = new Route({
      name,
      difficulty,
      type,
      location,
      ticks,
      user: userId,
    });
    await newRoute.save();
    console.log("New route created:", newRoute);
    res.redirect("/mycruxtrack/myroutes");
  } catch (error) {
    console.error("Error creating new route:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
