// src/routes/teamRoutes.js
// Team routes — CRUD will be implemented in a later phase.

const express = require("express");
const router = express.Router();

// GET /api/teams  (placeholder)
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Teams route is ready",
  });
});

module.exports = router;
