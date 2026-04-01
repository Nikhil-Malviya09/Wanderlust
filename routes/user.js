const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware/middleware');

const userController = require("../controllers/users");
const User = require("../models/user");

router.route("/signup")
    .get(
        userController.renderSignupForm
    )
    .post(
        wrapAsync(userController.signupUser)
    );

    
router.route("/verify").
    get(
        userController.renderVerifyForm
    )
    .post(
        userController.verifyOTP
    );


router.route("/login")
    .get(
        userController.renderLoginForm
    )
    .post(
        saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        userController.login
    );

router.get("/logout", userController.logout);


router.post("/switch-role", async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const newRole = req.user.role === "admin" ? "user" : "admin";

  await User.findByIdAndUpdate(req.user._id, {
    role: newRole
  });

  req.flash("success", `Role switched to ${newRole}`);
  res.redirect("/listings");
});

module.exports = router;
