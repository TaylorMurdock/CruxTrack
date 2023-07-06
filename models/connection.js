// import dependencies
require("dotenv").config(); // bring in our .env vars
const mongoose = require("mongoose"); // MongoDB ORM

// get DATABASE URI
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to MongoDB
mongoose.connect(DATABASE_URL);

// CONNECTION EVENTS
mongoose.connection
  .on("open", () => console.log("Connected to Mongo"))
  .on("close", () => console.log("Disconnected from Mongo"))
  .on("error", (error) => console.log(error));

// export the connection
module.exports = mongoose;
