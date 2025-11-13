const Listing = require("../models/listings");

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
  const newListing = new Listing(req.body.listing);
  console.log(req.user._id);
  newListing.owner = req.user._id;
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
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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
