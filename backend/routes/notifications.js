const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();
router.use(auth);
router.get("/", async (req, res) => { const [rows] = await pool.query("SELECT id, type, message, link, is_read AS isRead, created_at AS createdAt FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50", [req.userId]); res.json(rows); });
router.post("/:id/read", async (req, res) => { await pool.query("UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?", [req.params.id, req.userId]); res.status(204).end(); });
router.post("/read-all", async (req, res) => { await pool.query("UPDATE notifications SET is_read = TRUE WHERE user_id = ?", [req.userId]); res.status(204).end(); });
module.exports = router;
