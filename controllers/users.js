const User = require("../models/user");
const otpGenerator = require("otp-generator");
const sendOTP = require("../utils/sendOTP"); // email function


module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
};


module.exports.signupUser = async (req, res) => {
    try {

        let { username, email, password } = req.body;

          // check existing email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            req.flash("error", "Email already registered");
            return res.redirect("/login");
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

        // store signup data temporarily
        req.session.signupData = {
            username,
            email,
            password,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000
        };

        // Send Email
        await sendOTP(email, otp, username);

        req.flash("success", "OTP sent to your email");
        // res.send("Page Found");
        return res.redirect(`/verify`);

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.renderVerifyForm = (req, res) => {
    res.render("users/verify");
};


module.exports.verifyOTP = async (req, res) => {

    const { otp } = req.body;
    const { id } = req.params;

    const signupData = req.session.signupData;

    if (!signupData) {
        req.flash("error", "Session expired. Signup again.");
        return res.redirect("/signup");
    }

    if (signupData.otp !== otp) {
        req.flash("error", "Invalid OTP");
        return res.redirect("/verify");
    }

    if (signupData.otpExpiry < Date.now()) {
        req.flash("error", "OTP expired");
        return res.redirect("/signup");
    }

    // create user AFTER OTP verified
    const newUser = new User({
        username: signupData.username,
        email: signupData.email,
        isVerified: true
    });

  const registeredUser = await User.register(newUser, signupData.password);

    delete req.session.signupData;

    req.login(registeredUser, (err) => {
        if (err) return next(err);

        req.flash("success", "Email verified successfully!");
        res.redirect("/listings");
    });
};


module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};