// src/routes/taskRoutes.js
// Task routes — CRUD will be implemented in a later phase.

const express = require("express");
const router = express.Router();

// GET /api/tasks  (placeholder)
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tasks route is ready",
  });
});

module.exports = router;
