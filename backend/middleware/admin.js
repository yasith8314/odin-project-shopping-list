const auth = require("./auth");
const pool = require("../db");

module.exports = [auth, async (req, res, next) => {
  const [rows] = await pool.query("SELECT role FROM users WHERE id = ?", [req.userId]);
  if (!rows[0] || rows[0].role !== "admin") return res.status(403).json({ error: "Administrator access required." });
  next();
}];
