// src/routes/bugRoutes.js
// Routes for /api/bugs

const express = require("express");
const router = express.Router();

const bugController = require("../controllers/bugController");
const { protect } = require("../middleware/authMiddleware");
const { validateIdParam, validateBug } = require("../middleware/validateMiddleware");

router
  .route("/")
  .get(protect, bugController.getBugs)
  .post(protect, validateBug(false), bugController.createBug);

router
  .route("/:id")
  .get(protect, validateIdParam, bugController.getBugById)
  .put(protect, validateIdParam, validateBug(true), bugController.updateBug)
  .delete(protect, validateIdParam, bugController.deleteBug);

module.exports = router;
