const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
let sampleData = require("./data.js");

// MongoDB connection
main()
  .then((res) => {
    console.log("connection with database was successful...");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/staynest");
}

const addSampleData = async () => {
  await Listing.deleteMany({});
  sampleData = sampleData.map((obj) => ({
    ...obj,
    owner: "690feef456a3ecc2d0e184e1",
  }));
  const result = await Listing.insertMany(sampleData);
  console.log(result);
};

addSampleData();
