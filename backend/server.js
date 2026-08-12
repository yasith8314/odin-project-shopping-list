require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const preferencesRoutes = require("./routes/preferences");
const gamesRoutes = require("./routes/games");
const reviewsRoutes = require("./routes/reviews");
const analyticsRoutes = require("./routes/analytics");
const socialRoutes = require("./routes/social");
const adminRoutes = require("./routes/admin");
const notificationRoutes = require("./routes/notifications");
const { runMigrations } = require("./migrate");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferencesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", gamesRoutes);

const start = async () => {
  try {
    await runMigrations();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Unable to apply database migrations:", error);
    process.exit(1);
  }
};

start();
