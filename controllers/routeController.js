const express = require("express");
const router = express.Router();
const Route = require("../models/route");

// GET /cruxtrack/myroutes - List of Routes
router.get("/myroutes", async (req, res) => {
  try {
    const routes = await Route.find();
    res.render("myroutes", { routes });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /cruxtrack/route/:id - Specific Route Details
router.get("/route/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).send("Route not found");
    }

    res.render("routedetails", { route });
  } catch (error) {
    console.error("Error fetching route details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /cruxtrack/route/:id/edit - Edit Route Page
router.get("/route/:id/edit", async (req, res) => {
  try {
    const routeId = req.params.id;
    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).send("Route not found");
    }

    res.render("editRoute", { route });
  } catch (error) {
    console.error("Error fetching route details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST /cruxtrack/route/:id - Update Route
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

// DELETE /cruxtrack/route/:id - Delete Route
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

// GET /cruxtrack/newroute - Add New Route Page
router.get("/newroute", (req, res) => {
  res.render("newRoute");
});

// POST /cruxtrack/newroute - Create a New Route
router.post("/newroute", async (req, res) => {
  try {
    const { name, difficulty, type, location, ticks } = req.body;
    const newRoute = new Route({
      name,
      difficulty,
      type,
      location,
      ticks,
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
