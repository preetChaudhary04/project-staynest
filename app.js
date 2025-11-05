const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRoutes = require("./routes/listingsRoutes.js");
const reviewsRoute = require("./routes/reviewsRoutes.js");

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
main()
  .then((res) => {
    console.log("connection with database was successful...");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/staynest");
}

// Root Route
app.get("/", (req, res) => {
  res.send("Root route is working.");
});

app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoute);

// Invalid requests handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.render("listings/error", { error: { status, message } });
});

app.listen(3000, () => {
  console.log("app is listening at port 3000...");
});
