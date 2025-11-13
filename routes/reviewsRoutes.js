const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");
const { reviewSchemaJoi } = require("../utils/schemaValidator.js");
const { isLoggedIn, isReviewAuthor } = require("../middlewares.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchemaJoi.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Create Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    const listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added successfully.");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findOneAndUpdate(
      { _id: id },
      { $pull: { reviews: reviewId } }
    );
    await Review.findOneAndDelete(reviewId);
    req.flash("success", "Review deleted successfully.");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
