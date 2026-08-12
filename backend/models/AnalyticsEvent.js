const pool = require("../db");

const AnalyticsEvent = {
  async create({ userId, eventType, gameId, metadata }) {
    await pool.query(
      "INSERT INTO analytics_events (user_id, event_type, game_id, metadata) VALUES (?, ?, ?, ?)",
      [userId, eventType, gameId || null, Object.keys(metadata).length ? JSON.stringify(metadata) : null],
    );
  },
};

module.exports = AnalyticsEvent;
