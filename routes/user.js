const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passportLocalMongoose = require('passport-local-mongoose');

router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Create the new user
    const newUser = new User({ username, email });
    
    // Attempt to register the user
    const registeredUser = await User.register(newUser, password);
    console.log("Registered User:", registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // Handle login error
      } 
      req.flash("success", "User registered successfully!");
      res.redirect("/home"); // Only one response here
      }
    );

    // Flash success message


  } catch (err) {
    console.error("Registration Error:", err);

    // Check if the error is a duplicate key error (for email)
    if (err.code === 11000 && err.keyPattern?.email) {
      req.flash("error", "Email is already registered.");
    } else {
      req.flash("error", err.message); // For other types of errors
    }

    // Redirect back to the signup page with the error message
    res.redirect("/signup"); // Only this response is sent; no `res.send()` below
  }
});

router.get('/login', (req, res) => {
  res.render('./users/login.ejs'); // make sure you have a login.ejs view
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/home'); // or wherever you want to redirect after login
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return next(err); // Handle logout error
    }
    req.flash('success', 'Logged out successfully!');
    res.redirect('/home'); // Redirect to login page after logout
  });
}); 


module.exports = router;
