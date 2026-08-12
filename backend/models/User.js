const pool = require("../db");

const User = {
  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT id, email, favorites, platform, theme FROM users WHERE id = ?",
      [id],
    );
    if (!rows[0]) return null;
    const user = rows[0];
    // Parse favorites safely
    if (typeof user.favorites === "string") {
      try {
        user.favorites = JSON.parse(user.favorites);
      } catch {
        user.favorites = [];
      }
    } else if (!Array.isArray(user.favorites)) {
      user.favorites = [];
    }
    return user;
  },

  create: async (email, hashedPassword) => {
    const [result] = await pool.query(
      "INSERT INTO users (email, password, favorites, platform, theme) VALUES (?, ?, ?, ?, ?)",
      [email, hashedPassword, JSON.stringify([]), "all", "dark"],
    );
    return {
      id: result.insertId,
      email,
      favorites: [],
      platform: "all",
      theme: "dark",
    };
  },

  updatePreferences: async (userId, updates) => {
    const fields = [];
    const values = [];

    if (updates.favorites !== undefined) {
      fields.push("favorites = ?");
      values.push(JSON.stringify(updates.favorites));
    }
    if (updates.platform !== undefined) {
      fields.push("platform = ?");
      values.push(updates.platform);
    }
    if (updates.theme !== undefined) {
      fields.push("theme = ?");
      values.push(updates.theme);
    }

    if (fields.length === 0) return null;

    values.push(userId);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await pool.query(query, values);

    return User.findById(userId);
  },

  toggleFavorite: async (userId, gameId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const favorites = user.favorites || [];
    const index = favorites.indexOf(gameId);
    if (index === -1) {
      favorites.push(gameId);
    } else {
      favorites.splice(index, 1);
    }

    // Store as JSON string
    await pool.query("UPDATE users SET favorites = ? WHERE id = ?", [
      JSON.stringify(favorites),
      userId,
    ]);
    return favorites;
  },

  getFavorites: async (userId) => {
    const user = await User.findById(userId);
    return user ? user.favorites : [];
  },
};

module.exports = User;
