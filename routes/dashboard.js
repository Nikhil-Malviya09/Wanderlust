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

    // ✅ Bookings made by OTHER users (not admin)
    const totalBookings = await Booking.countDocuments({
      user: { $ne: req.user._id }
    });

    // ✅ Recent bookings by OTHER users
    const recentBookings = await Booking.find({
      user: { $ne: req.user._id }
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