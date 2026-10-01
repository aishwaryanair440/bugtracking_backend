// src/routes/bugRoutes.js
// Bug report routes — CRUD will be implemented in a later phase.

const express = require("express");
const router = express.Router();

// GET /api/bugs  (placeholder)
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bugs route is ready",
  });
});

module.exports = router;
