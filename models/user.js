const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt for password hashing
    const hashedPassword = await bcrypt.hash(this.password, salt); // Hash the password using the generated salt
    this.password = hashedPassword; // Replace the original password with the hashed password
    next(); // Proceed to save the user to the database
  } catch (error) {
    next(error); // Pass any errors to the next middleware or error handler
  }
});

const User = mongoose.model("User", userSchema); // Create the User model

module.exports = User; // Export the User model for external use
