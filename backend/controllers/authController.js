const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "safejourney_secret_key_change_in_production";

// Helper function to generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: "7d" });
};

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, name, email, phone, gender, age, city, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Use firstName/lastName if provided, otherwise use name
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : (name || firstName || lastName || "User");

    const user = await User.create({
      name: fullName,
      email,
      phone,
      gender,
      age,
      city,
      password: hashed,
    });

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    res.json({ 
      message: "Signup success", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        firstName: firstName || user.name.split(" ")[0],
        role: "user"
      },
      token 
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    // Check if user has a password (for Google OAuth users)
    if (!user.password) {
      return res.status(400).json({ error: "Please use Google login for this account" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid email or password" });

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    res.json({ 
      message: "Login success", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        firstName: user.name.split(" ")[0],
        role: "user"
      },
      token 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token, email, name, googleId } = req.body;

    // For now, we'll accept email and name directly
    // In production, you should verify the Google token server-side
    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: googleId || token,
      });
    } else {
      // Update googleId if not set
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id, user.email);

    res.json({ 
      message: "Google login success", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        firstName: user.name.split(" ")[0],
        role: "user"
      },
      token: jwtToken 
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google login failed", details: err.message });
  }
};
