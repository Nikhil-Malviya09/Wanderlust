const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");

router.get("/my", async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing");

  res.render("bookings/index.ejs", { bookings });
});


router.post("/", async (req, res) => {
  const { listingId, checkIn, checkOut } = req.body;

   // Check login 
  if (!req.user) {
    return res.redirect("/login");
  }

  // Validate dates
  if (new Date(checkOut) <= new Date(checkIn)) {
    req.flash("error", "Invalid dates!");
    return  res.redirect("/listings");

  }

  // STEP 1: Check for existing booking (ADD HERE)
  const existingBooking = await Booking.findOne({
    listing: listingId,
    $or: [
      {
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) }
      }
    ]
  });

  if (existingBooking) {
    req.flash("error", "Dates already booked!");
    return  res.redirect("/listings");
  }

  // 🔵 STEP 2: Get listing price
  const listing = await Listing.findById(listingId);

  // 🔵 STEP 3: Calculate days
  const days = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
  );

  // 🔵 STEP 4: Create booking
  const booking = new Booking({
    listing: listingId,
    user: req.user._id,
    checkIn,
    checkOut,
  });

  // 🔵 STEP 5: Add total price
  booking.totalPrice = days * listing.price;

  // 🔵 STEP 6: Save
  await booking.save();
  req.flash("success", "Booking Successfully!");
  res.redirect("/listings");
});

module.exports = router;