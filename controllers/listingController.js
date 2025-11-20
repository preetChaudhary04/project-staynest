const Listing = require("../models/listings");
const ExpressError = require("../utils/ExpressError");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Show all Listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// New Listing Form
module.exports.newListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show a particular Listing
module.exports.showListing = async (req, res) => {
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
};

// Create New Listing
module.exports.createNewListing = async (req, res) => {
  if (!req.body)
    throw new ExpressError(400, "Please fill in the required details.");
  if (!req.file) throw new ExpressError(400, "Image is required!");
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Listing added successfully.");
  res.redirect("/listings");
};

// Edit Listing Form
module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist.");
    res.redirect("/listings");
  } else {
    res.render("listings/edit.ejs", { listing });
  }
};

// Update Listing
module.exports.updateListing = async (req, res) => {
  let url, filename;
  if (req.file) {
    url = req.file.path;
    filename = req.file.filename;
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  listing.image = { url, filename };
  await listing.save();
  req.flash("success", "Listing updated successfully.");
  res.redirect(`/listings/${id}`);
};

// Destroy Listing
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully.");
  res.redirect("/listings");
};
