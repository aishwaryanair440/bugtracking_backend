// src/routes/projectRoutes.js
// Project routes — CRUD will be implemented in a later phase.

const express = require("express");
const router = express.Router();

// GET /api/projects  (placeholder)
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Projects route is ready",
  });
});

module.exports = router;
