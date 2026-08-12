const express = require("express");
const pool = require("../db");
const admin = require("../middleware/admin");
const { clearCache } = require("./games");
const router = express.Router();
router.use(admin);
router.get("/stats", async (req, res) => {
  const [[users], [reviews], [events], [active], [comments], [popular]] = await Promise.all([
    pool.query("SELECT COUNT(*) AS count FROM users"), pool.query("SELECT COUNT(*) AS count FROM reviews"),
    pool.query("SELECT COUNT(*) AS count FROM analytics_events"), pool.query("SELECT COUNT(DISTINCT user_id) AS count FROM analytics_events WHERE created_at >= CURRENT_DATE"),
    pool.query("SELECT COUNT(*) AS count FROM game_comments"),
    pool.query("SELECT jt.gameId, COUNT(*) AS favorites FROM users u JOIN JSON_TABLE(u.favorites, '$[*]' COLUMNS (gameId INT PATH '$')) jt GROUP BY jt.gameId ORDER BY favorites DESC LIMIT 10"),
  ]);
  res.json({ users: Number(users[0].count), reviews: Number(reviews[0].count), comments: Number(comments[0].count), events: Number(events[0].count), dailyActiveUsers: Number(active[0].count), mostFavorited: popular });
});
router.get("/reviews", async (req, res) => { const [rows] = await pool.query("SELECT r.id, r.game_id AS gameId, r.rating, r.comment, r.created_at AS createdAt, u.email FROM reviews r JOIN users u ON u.id = r.user_id ORDER BY r.created_at DESC LIMIT 100"); res.json(rows); });
router.delete("/reviews/:id", async (req, res) => { await pool.query("DELETE FROM reviews WHERE id = ?", [req.params.id]); res.status(204).end(); });
router.get("/comments", async (req, res) => { const [rows] = await pool.query("SELECT c.id, c.game_id AS gameId, c.body, c.created_at AS createdAt, u.email FROM game_comments c JOIN users u ON u.id = c.user_id ORDER BY c.created_at DESC LIMIT 100"); res.json(rows); });
router.delete("/comments/:id", async (req, res) => { await pool.query("DELETE FROM game_comments WHERE id = ?", [req.params.id]); res.status(204).end(); });
router.post("/cache/refresh", (req, res) => { clearCache(); res.status(204).end(); });
module.exports = router;
