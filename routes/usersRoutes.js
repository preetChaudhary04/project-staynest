const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/users.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;
  const newUser = new User({ username, email });
  let reg = await User.register(newUser, password);
  req.login(reg, (err) => {
    if (err) return next(err);
    req.flash("success", "Welcome to StayNest!");
    res.redirect(req.session.redirectUrl);
  });
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Logged In successfully!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  });
});

module.exports = router;
