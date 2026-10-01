// src/routes/projectRoutes.js
// Routes for /api/projects
//
// Protected with JWT middleware. Faculty-only restrictions applied for creation/modification.

const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { validateIdParam, validateProject } = require("../middleware/validateMiddleware");

// GET    /api/projects      → Get all projects (Authenticated users)
// POST   /api/projects      → Create a new project (Faculty only)
router
  .route("/")
  .get(protect, projectController.getProjects)
  .post(protect, requireRole("faculty"), validateProject(false), projectController.createProject);

// GET    /api/projects/:id  → Get a single project
// PUT    /api/projects/:id  → Update a project (Faculty only)
// DELETE /api/projects/:id  → Delete a project (Faculty only)
router
  .route("/:id")
  .get(protect, validateIdParam, projectController.getProjectById)
  .put(protect, requireRole("faculty"), validateIdParam, validateProject(true), projectController.updateProject)
  .delete(protect, requireRole("faculty"), validateIdParam, projectController.deleteProject);

module.exports = router;
