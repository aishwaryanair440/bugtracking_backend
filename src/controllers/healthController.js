// src/controllers/healthController.js
// Handles the health-check endpoints.
//
// GET /api/health    — checks that the server is running (no DB needed)
// GET /api/health/db — tests whether MySQL is reachable

const db = require("../config/database");

const healthController = {
  // ── GET /api/health ──────────────────────────────────────────────────────────
  // Simple check — does NOT touch the database.
  checkHealth: (req, res) => {
    res.status(200).json({
      success: true,
      message: "Backend is running",
    });
  },

  // ── GET /api/health/db ───────────────────────────────────────────────────────
  // Tests whether the backend can connect to MySQL.
  // Runs a lightweight query (SELECT 1) that works on any MySQL server
  // without needing any tables to exist.
  checkDatabase: async (req, res) => {
    try {
      await db.query("SELECT 1"); // If this doesn't throw, the connection works

      res.status(200).json({
        success: true,
        message: "MySQL database connected successfully",
      });
    } catch (error) {
      // Log the real error on the server (never send it to the client)
      console.error("[DB Health Check Failed]", error.message);

      res.status(200).json({
        // 200 so the HTTP request itself succeeds — the JSON tells us the DB status
        success: false,
        message: "MySQL database connection failed",
      });
    }
  },
};

module.exports = healthController;
