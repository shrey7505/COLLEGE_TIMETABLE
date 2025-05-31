const ItListing = require('./models/itlisting.js');
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be LogIn in first!');
    return res.redirect('/login');
  }
  next();
}

module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || req.user._id.toString() !== "67ff31a54b2d29d2457265b1") {
    req.flash("error", "You do not have permission to do that.");
    return res.redirect(req.get('Referrer') || "/home"); 
  }
  next();
};


