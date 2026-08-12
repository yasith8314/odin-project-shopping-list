const express = require("express");
const crypto = require("crypto");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();
const id = (value) => Number.isInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;

router.post("/follow/:userId", auth, async (req, res) => {
  const followedId = id(req.params.userId);
  if (!followedId || followedId === req.userId) return res.status(400).json({ error: "Choose another user." });
  await pool.query("INSERT IGNORE INTO follows (follower_id, followed_id) VALUES (?, ?)", [req.userId, followedId]);
  res.status(204).end();
});
router.delete("/follow/:userId", auth, async (req, res) => {
  await pool.query("DELETE FROM follows WHERE follower_id = ? AND followed_id = ?", [req.userId, id(req.params.userId)]);
  res.status(204).end();
});
router.get("/following", auth, async (req, res) => {
  const [rows] = await pool.query("SELECT u.id, u.email FROM follows f JOIN users u ON u.id = f.followed_id WHERE f.follower_id = ? ORDER BY u.email", [req.userId]);
  res.json(rows);
});

router.post("/lists", auth, async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim().slice(0, 120) : "";
  const gameIds = Array.isArray(req.body.gameIds) ? req.body.gameIds.map(id).filter(Boolean).slice(0, 10) : [];
  if (!title || !gameIds.length) return res.status(400).json({ error: "A title and at least one game are required." });
  const token = crypto.randomUUID();
  const [result] = await pool.query("INSERT INTO shared_lists (user_id, title, description, is_public, share_token) VALUES (?, ?, ?, ?, ?)", [req.userId, title, String(req.body.description || "").slice(0, 500), req.body.isPublic !== false, token]);
  await pool.query("INSERT INTO shared_list_items (list_id, game_id, position) VALUES ?", [gameIds.map((gameId, position) => [result.insertId, gameId, position])]);
  res.status(201).json({ id: result.insertId, shareToken: token });
});
router.get("/lists/:token", async (req, res) => {
  const [rows] = await pool.query("SELECT l.id, l.title, l.description, l.share_token AS shareToken, u.email AS owner, i.game_id AS gameId, i.position FROM shared_lists l JOIN users u ON u.id = l.user_id JOIN shared_list_items i ON i.list_id = l.id WHERE l.share_token = ? AND l.is_public = TRUE ORDER BY i.position", [req.params.token]);
  if (!rows.length) return res.status(404).json({ error: "List not found." });
  const { id: listId, title, description, shareToken, owner } = rows[0];
  res.json({ id: listId, title, description, shareToken, owner, gameIds: rows.map((row) => row.gameId) });
});

router.get("/comments", async (req, res) => {
  const gameId = id(req.query.gameId);
  if (!gameId) return res.status(400).json({ error: "A valid gameId is required." });
  const [rows] = await pool.query("SELECT c.id, c.user_id AS userId, u.email AS author, c.parent_id AS parentId, c.body, c.created_at AS createdAt FROM game_comments c JOIN users u ON u.id = c.user_id WHERE c.game_id = ? ORDER BY c.created_at ASC", [gameId]);
  res.json(rows);
});
router.post("/comments", auth, async (req, res) => {
  const gameId = id(req.body.gameId); const body = typeof req.body.body === "string" ? req.body.body.trim() : "";
  const parentId = req.body.parentId ? id(req.body.parentId) : null;
  if (!gameId || !body || body.length > 2000) return res.status(400).json({ error: "A valid game and comment are required." });
  const [result] = await pool.query("INSERT INTO game_comments (user_id, game_id, parent_id, body) VALUES (?, ?, ?, ?)", [req.userId, gameId, parentId, body]);
  res.status(201).json({ id: result.insertId });
});

module.exports = router;
