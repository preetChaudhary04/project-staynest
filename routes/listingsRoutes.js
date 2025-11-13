const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner } = require("../middlewares.js");

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing does not exist.");
      res.redirect("/listings");
    } else {
      res.render("listings/show.ejs", { listing });
    }
  })
);

// Create Route
router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    if (!req.body)
      throw new ExpressError(400, "Please fill in the required details.");
    const newListing = new Listing(req.body.listing);
    console.log(req.user._id);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing added successfully.");
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not exist.");
      res.redirect("/listings");
    } else {
      res.render("listings/edit.ejs", { listing });
    }
  })
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully.");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully.");
    res.redirect("/listings");
  })
);

module.exports = router;
