const express = require("express");

const router = express.Router();
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;
const FREE_TO_GAME_URL = "https://www.freetogame.com/api";
const clearCache = () => cache.clear();

const readCached = (key) => {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.value;
};

const fetchFromProvider = async (path) => {
  const cached = readCached(path);
  if (cached) return cached;
  const response = await fetch(`${FREE_TO_GAME_URL}/${path}`);
  if (!response.ok) throw new Error(`Game provider returned ${response.status}`);
  const value = await response.json();
  cache.set(path, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
};

router.get("/games", async (req, res) => {
  const path = req.query.query;
  if (typeof path !== "string" || !/^(games|game\?id=\d+)([?&][\w-]+=[\w-]+)*$/.test(path)) {
    return res.status(400).json({ error: "Invalid game query." });
  }
  try { return res.json(await fetchFromProvider(path)); }
  catch (error) { return res.status(502).json({ error: "Game data is temporarily unavailable." }); }
});

module.exports = router;
module.exports.clearCache = clearCache;
