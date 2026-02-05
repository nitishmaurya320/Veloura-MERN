const nodemailer = require("nodemailer");

// Example: Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // app password
  },
});

const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Veloura" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    });
    console.log("OTP email sent to:", to);
  } catch (err) {
    console.error("Error sending OTP email:", err);
  }
};


module.exports = sendOtpEmail;
