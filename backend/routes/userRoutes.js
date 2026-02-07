const express = require("express");
const User = require("../models/user");
const OTP = require("../models/otp");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
dotenv.config();
const { protect } = require("../middleware/authMiddleware");
const sendOtpEmail = require("../utils/sendOtpEmail");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

//register a new user
//access public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //registration logic

    let user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "user Already exists" });
      } else {
        const updateData = {};

        if (name) updateData.name = name;
        if (password) updateData.password = password; // plain value as you asked

        // Only update if there is something to update
        if (Object.keys(updateData).length > 0) {
          await User.findOneAndUpdate({ email }, updateData);
        }
      }
    } else {
      // If user doesn't exist, you can create a new one if needed
      user = new User({
        name,
        email, // fallback if no name
        password, // fallback if no password
      });
      await user.save();
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtpEmail(email, otp);
    console.log(otp);
    await OTP.findOneAndUpdate(
      { identifier: email }, // 🔍 search condition
      {
        otp,
        isVerified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      {
        upsert: true, // ⭐ THIS is the magic
        new: true,
      },
    );
    res.status(201).json({ message: "User registered. OTP sent", email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

//otp-verification
router.post("/verify-otp", async (req, res) => {
  const { otp, identifier } = req.body;

  try {
    let otpRecord = await OTP.findOne({ identifier });
    if (!otp) {
      return res.status(400).json({ message: "Enter the OTP" });
    }
    if (!otpRecord) {
      return res.status(404).json({ message: "Invalid or Expired OTP" });
    }
    if (otpRecord.isVerified) {
      return res.status(400).json({ message: "OTP already verified" });
    }

    if (otp !== otpRecord.otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    otpRecord.isVerified = true;
    await otpRecord.save();
    let user = await User.findOne({ email: identifier });
    user.isVerified = true;
    await user.save();
    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;
        res.cookie("access_token", token, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production", // true in prod (HTTPS)
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 40 * 60 * 60 * 1000, // 40h
        });

        res.status(201).json({
          user,
          success: true,
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

//@route api/users/login
//access public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.send("user not exist");

    const ismatch = await user.matchPassword(password);
    if (!ismatch)
      return res.status(400).json({ message: "invalid credentials" });
    //jwebtoken payload
    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;
        res.cookie("access_token", token, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production", // true in prod (HTTPS)
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 40 * 60 * 60 * 1000, // 40h
        });

        res.status(201).json({ user });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});
router.post("/google", async (req, res) => {
  console.log("1");

  try {
    const { token } = req.body;
    console.log("TOKEN RECEIVED:", !!token);
    console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      console.error("VERIFY ID TOKEN ERROR 👇");
      console.error(err);
      return res.status(401).json({
        message: "Google token verification failed",
        error: err.message,
      });
    }

    console.log("haha"); // THIS WILL PRINT only if verification passes

    const { email, name, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        isVerified: true,
        avatar: picture,
        authProvider: "google",
      });
    }
    const payload = { user: { id: user._id, role: user.role } };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 40 * 60 * 60 * 1000,
    });

    res.status(200).json({ user });
  } catch (err) {
    console.error("OUTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/logout", async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on Vercel
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // match login cookie
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

//@route GET api/users/profile

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
