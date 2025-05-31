const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  }
});

// Add username, hash, salt, and register method
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
