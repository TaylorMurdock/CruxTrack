const express = require("express");
const router = express.Router();
const Route = require("../models/route");

// GET /cruxtrack/myRoutes - List of Routes
router.get("/myRoutes", async (req, res) => {
  try {
    const routes = await Route.find(); // Fetch all routes from the database
    console.log(routes); // Check if routes are properly retrieved
    res.render("myRoutes", { routes });
    console.log("Rendered myRoutes template"); // Check if the template is rendered
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /cruxtrack/route/:id - Specific Route Details
router.get("/route/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    const route = await Route.findById(routeId); // Fetch the specific route by its ID

    if (!route) {
      return res.status(404).send("Route not found");
    }

    res.render("routeDetails", { route });
  } catch (error) {
    console.error("Error fetching route details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /cruxtrack/newRoute - Add New Route Page
router.get("/newRoute", (req, res) => {
  res.render("newRoute");
});

module.exports = router;
