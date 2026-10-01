// src/routes/authRoutes.js
// Authentication routes — CRUD will be implemented in a later phase.

const express = require("express");
const router = express.Router();

// POST /api/auth  (placeholder)
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth route is ready",
  });
});

module.exports = router;
