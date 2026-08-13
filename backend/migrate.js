const fs = require("fs/promises");
const path = require("path");
const pool = require("./db");

const migrationsDirectory = path.join(__dirname, "migrations");

const runMigrations = async () => {
  // Get a connection from the pool to keep session settings consistent
  const connection = await pool.getConnection();

  try {
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    await connection.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (name VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    );
    const [appliedRows] = await connection.query(
      "SELECT name FROM schema_migrations",
    );
    const applied = new Set(appliedRows.map((row) => row.name));
    const entries = await fs.readdir(migrationsDirectory);

    for (const name of entries
      .filter((entry) => /^\d+_.+\.sql$/.test(entry))
      .sort()) {
      if (applied.has(name)) continue;
      const sql = await fs.readFile(
        path.join(migrationsDirectory, name),
        "utf8",
      );
      const statements = sql
        .split(/;\s*(?:\r?\n|$)/)
        .map((s) => s.trim())
        .filter(Boolean);
      for (const statement of statements) {
        // Optional: skip ALTER for role if column already exists (as in your code)
        if (/^ALTER TABLE users ADD COLUMN role\b/i.test(statement)) {
          const [columns] = await connection.query(
            "SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'role' LIMIT 1",
          );
          if (columns.length) continue;
        }
        await connection.query(statement);
      }
      await connection.query(
        "INSERT INTO schema_migrations (name) VALUES (?)",
        [name],
      );
      console.log(`Applied database migration: ${name}`);
    }

    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  } finally {
    connection.release();
  }
};

module.exports = { runMigrations };
