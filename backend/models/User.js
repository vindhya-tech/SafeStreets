const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  gender: String,
  age: Number,
  city: String,
  password: String,
  googleId: String,
});

module.exports = mongoose.model("User", UserSchema);
