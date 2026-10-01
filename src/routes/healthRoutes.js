// src/routes/healthRoutes.js
// Routes for health-check endpoints.

const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");

// GET /api/health      → checks the server is running
router.get("/health", healthController.checkHealth);

// GET /api/health/db   → tests the MySQL database connection
router.get("/health/db", healthController.checkDatabase);

module.exports = router;
