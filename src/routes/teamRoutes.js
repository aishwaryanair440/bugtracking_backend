// src/routes/teamRoutes.js
// Routes for /api/teams

const express = require("express");
const router = express.Router();

const teamController = require("../controllers/teamController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { validateIdParam, validateTeam } = require("../middleware/validateMiddleware");

router
  .route("/")
  .get(protect, teamController.getTeams)
  .post(protect, requireRole("faculty"), validateTeam(false), teamController.createTeam);

router
  .route("/:id")
  .get(protect, validateIdParam, teamController.getTeamById)
  .put(protect, requireRole("faculty"), validateIdParam, validateTeam(true), teamController.updateTeam)
  .delete(protect, requireRole("faculty"), validateIdParam, teamController.deleteTeam);

module.exports = router;
