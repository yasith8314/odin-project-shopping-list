const express = require("express");
const auth = require("../middleware/auth");
const AnalyticsEvent = require("../models/AnalyticsEvent");

const router = express.Router();
const ALLOWED_EVENTS = new Set(["game_view", "search", "filters_changed", "favorite_add", "favorite_remove", "wishlist_add", "wishlist_remove", "review_created", "page_view"]);
const MAX_METADATA_LENGTH = 100;

const positiveInteger = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};

const sanitizeMetadata = (metadata) => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};
  return Object.fromEntries(Object.entries(metadata)
    .filter(([key, value]) => /^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(key) && typeof value === "string")
    .map(([key, value]) => [key, value.trim().slice(0, MAX_METADATA_LENGTH)]));
};

router.post("/events", auth, async (req, res) => {
  const { eventType } = req.body;
  const gameId = req.body.gameId === undefined ? null : positiveInteger(req.body.gameId);
  if (!ALLOWED_EVENTS.has(eventType)) return res.status(400).json({ error: "Unsupported analytics event." });
  if (req.body.gameId !== undefined && !gameId) return res.status(400).json({ error: "A valid gameId is required." });

  try {
    await AnalyticsEvent.create({ userId: req.userId, eventType, gameId, metadata: sanitizeMetadata(req.body.metadata) });
    return res.status(204).end();
  } catch (error) {
    console.error("Unable to record analytics event:", error);
    return res.status(500).json({ error: "Unable to record analytics event." });
  }
});

module.exports = router;
