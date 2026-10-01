// src/routes/studentRoutes.js
// Routes for /api/students

const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { validateIdParam, validateStudent } = require("../middleware/validateMiddleware");

router
  .route("/")
  .get(protect, studentController.getStudents)
  .post(protect, requireRole("faculty"), validateStudent(false), studentController.createStudent);

router
  .route("/:id")
  .get(protect, validateIdParam, studentController.getStudentById)
  .put(protect, validateIdParam, validateStudent(true), studentController.updateStudent)
  .delete(protect, requireRole("faculty"), validateIdParam, studentController.deleteStudent);

module.exports = router;
