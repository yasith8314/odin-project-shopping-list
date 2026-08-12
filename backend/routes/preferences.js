const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();
router.use(auth);

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

router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      favorites: user.favorites || [],
      platform: user.platform || "all",
      theme: user.theme || "dark",
      role: user.role || "user",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/preferences
router.put("/", async (req, res) => {
  try {
    const { favorites, platform, theme } = req.body;
    const updates = {};
    if (favorites !== undefined) updates.favorites = favorites;
    if (platform !== undefined) updates.platform = platform;
    if (theme !== undefined) updates.theme = theme;

    const updatedUser = await User.updatePreferences(req.userId, updates);
    if (!updatedUser)
      return res.status(400).json({ error: "No fields to update" });

    res.json({
      favorites: parseFavorites(updatedUser.favorites),
      platform: updatedUser.platform || "all",
      theme: updatedUser.theme || "dark",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/preferences/favorites/toggle
router.post("/favorites/toggle", async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!Number.isInteger(gameId) || gameId < 1) return res.status(400).json({ error: "A valid gameId is required" });

    const favorites = await User.toggleFavorite(req.userId, gameId);
    res.json({ favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/preferences/favorites/check/:gameId
router.get("/favorites/check/:gameId", async (req, res) => {
  try {
    const gameId = Number(req.params.gameId);
    if (!Number.isInteger(gameId) || gameId < 1) return res.status(400).json({ error: "A valid gameId is required" });
    const favorites = await User.getFavorites(req.userId);
    const isFavorite = favorites.includes(gameId);
    res.json({ isFavorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
