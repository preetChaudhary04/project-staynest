const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middlewares.js");
const listingController = require("../controllers/listingController.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, wrapAsync(listingController.createNewListing));

router.get("/new", isLoggedIn, listingController.newListingForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingForm)
);

module.exports = router;
