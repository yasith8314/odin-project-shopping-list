const pool = require("../db");

const Review = {
  async findByGameId(gameId) {
    const [rows] = await pool.query(
      `SELECT id, user_id AS userId, game_id AS gameId, rating, comment,
              created_at AS createdAt, updated_at AS updatedAt
       FROM reviews
       WHERE game_id = ?
       ORDER BY created_at DESC`,
      [gameId],
    );
    return rows;
  },

  async getSummary(gameId) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS reviewCount, COALESCE(ROUND(AVG(rating), 1), 0) AS averageRating FROM reviews WHERE game_id = ?",
      [gameId],
    );
    return rows[0];
  },

  async create(userId, gameId, rating, comment) {
    const [result] = await pool.query(
      "INSERT INTO reviews (user_id, game_id, rating, comment) VALUES (?, ?, ?, ?)",
      [userId, gameId, rating, comment],
    );
    return this.findById(result.insertId);
  },

  async findById(reviewId) {
    const [rows] = await pool.query(
      `SELECT id, user_id AS userId, game_id AS gameId, rating, comment,
              created_at AS createdAt, updated_at AS updatedAt
       FROM reviews WHERE id = ?`,
      [reviewId],
    );
    return rows[0] || null;
  },

  async update(reviewId, userId, rating, comment) {
    const [result] = await pool.query(
      "UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?",
      [rating, comment, reviewId, userId],
    );
    return result.affectedRows ? this.findById(reviewId) : null;
  },

  async remove(reviewId, userId) {
    const [result] = await pool.query(
      "DELETE FROM reviews WHERE id = ? AND user_id = ?",
      [reviewId, userId],
    );
    return result.affectedRows > 0;
  },
};

module.exports = Review;
