const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middlewares.js");
const listingController = require("../controllers/listingController.js");

// Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.newListingForm);

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/", isLoggedIn, wrapAsync(listingController.createNewListing));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingForm)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
