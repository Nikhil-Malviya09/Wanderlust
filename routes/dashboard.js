const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const User = require("../models/user");


router.get("/", async (req, res) => {
  if (!req.user) return res.redirect("/login");

  // 👑 ADMIN DASHBOARD
  if (req.user.role === "admin") {

    // ✅ Only admin's listings
    const totalListings = await Listing.countDocuments({
      owner: req.user._id
    });

    const adminListings = await Listing.find({
      owner: req.user._id
    }).select("_id");

    const listingIds = adminListings.map(listing => listing._id);

    // ✅ Bookings made by OTHER users (not admin)
    const totalBookings = await Booking.countDocuments({
      listing: { $in: listingIds }
    });

    // ✅ Recent bookings by OTHER users
    const recentBookings = await Booking.find({
      listing: { $in: listingIds }
    })
      .populate("listing user")
      .sort({ createdAt: -1 })
      .limit(5);

    res.render("dashboard/admin.ejs", {
      totalListings,
      totalBookings,
      recentBookings
    });
  }
});

module.exports = router;