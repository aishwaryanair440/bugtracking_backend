// src/routes/taskRoutes.js
// Routes for /api/tasks

const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { validateIdParam, validateTask } = require("../middleware/validateMiddleware");

router
  .route("/")
  .get(protect, taskController.getTasks)
  .post(protect, validateTask(false), taskController.createTask);

router
  .route("/:id")
  .get(protect, validateIdParam, taskController.getTaskById)
  .put(protect, validateIdParam, validateTask(true), taskController.updateTask)
  .delete(protect, validateIdParam, taskController.deleteTask);

module.exports = router;
