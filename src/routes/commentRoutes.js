// src/routes/commentRoutes.js
// Comment routes — CRUD will be implemented in a later phase.

const express = require("express");
const router = express.Router();

// GET /api/comments  (placeholder)
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Comments route is ready",
  });
});

module.exports = router;
