const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOTP = async (email, otp, username) => {

  await transporter.sendMail({
    from: `"Wandero" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verify your email - Wandero",
    
    html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:30px;">
        <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:10px; text-align:center; box-shadow:0 0 10px rgba(0,0,0,0.1);">
          
          <h2 style="color:#ff385c;">Wandero</h2>
          
          <p style="font-size:16px; color:#333;">
            Hello ${username},
          </p>

          <p style="font-size:15px; color:#555;">
            Thank you for signing up. Please use the OTP below to verify your email address.
          </p>

          <div style="margin:25px 0;">
            <span style="
              font-size:28px;
              letter-spacing:6px;
              background:#f2f2f2;
              padding:12px 25px;
              border-radius:8px;
              display:inline-block;
              font-weight:bold;
            ">
              ${otp}
            </span>
          </div>

          <p style="color:#777; font-size:14px;">
            This OTP will expire in <b>5 minutes</b>.
          </p>

          <p style="color:#999; font-size:12px; margin-top:25px;">
            If you did not request this, you can safely ignore this email.
          </p>

        </div>
      </div>
    `
  });

};

module.exports = sendOTP;
