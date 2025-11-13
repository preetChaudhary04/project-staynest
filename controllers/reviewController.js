const Review = require("../models/reviews");
const Listing = require("../models/listings");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  const listing = await Listing.findById(id);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review added successfully.");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findOneAndUpdate({ _id: id }, { $pull: { reviews: reviewId } });
  await Review.findOneAndDelete(reviewId);
  req.flash("success", "Review deleted successfully.");
  res.redirect(`/listings/${id}`);
};
