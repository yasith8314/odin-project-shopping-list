// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const parseFavorites = (favorites) => {
  if (Array.isArray(favorites)) return favorites;
  if (typeof favorites !== "string") return [];

  try {
    const parsed = JSON.parse(favorites);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 8) {
      return res.status(400).json({ error: "Enter a valid email and a password of at least 8 characters." });
    }

    // Check if user exists
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findByEmail(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create(normalizedEmail, hashedPassword);

    // Generate JWT
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        preferences: {
          favorites: newUser.favorites || [],
          platform: newUser.platform || "all",
          theme: newUser.theme || "dark",
        },
        role: "user",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

    const user = await User.findByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        preferences: {
          favorites: parseFavorites(user.favorites),
          platform: user.platform || "all",
          theme: user.theme || "dark",
        },
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;
