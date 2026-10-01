// src/routes/studentRoutes.js
// Student routes — CRUD will be implemented in a later phase.

const express = require("express");
const router = express.Router();

// GET /api/students  (placeholder)
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Students route is ready",
  });
});

module.exports = router;
