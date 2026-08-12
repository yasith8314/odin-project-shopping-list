// db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "", // <-- explicit fallback
  database: process.env.MYSQL_DATABASE || "gameapp",
  waitForConnections: true,
  connectionLimit: 10,
});

// Optional: test connection on startup
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection error:", err.message);
    process.exit(1); // or handle gracefully
  });

module.exports = pool;
