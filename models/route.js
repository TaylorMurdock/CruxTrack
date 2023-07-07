const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  ticks: {
    type: String,
    required: true,
  },
  // Add more properties as needed
});

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
