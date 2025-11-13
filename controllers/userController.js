const User = require("../models/users.js");

// SignUp Form
module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// SignUp
module.exports.signup = async (req, res) => {
  let { username, email, password } = req.body;
  const newUser = new User({ username, email });
  let reg = await User.register(newUser, password);
  req.login(reg, (err) => {
    if (err) return next(err);
    req.flash("success", "Welcome to StayNest!");
    res.redirect(req.session.redirectUrl);
  });
};

// Login Form
module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Login
module.exports.login = async (req, res) => {
  req.flash("success", "Logged In successfully!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  });
};
