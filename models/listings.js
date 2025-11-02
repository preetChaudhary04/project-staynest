const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    set: (v) =>
      v === ""
        ? "https://www.freepik.com/free-vector/beautiful-home_4979878.htm#fromView=keyword&page=1&position=5&uuid=aaedc8d9-d35f-433e-8cee-5f459d6aa0b9&query=House"
        : v,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
