// src/routes/commentRoutes.js
// Routes for /api/comments

const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");
const { validateIdParam, validateComment } = require("../middleware/validateMiddleware");

router
  .route("/")
  .get(protect, commentController.getComments)
  .post(protect, validateComment(false), commentController.createComment);

router
  .route("/:id")
  .get(protect, validateIdParam, commentController.getCommentById)
  .put(protect, validateIdParam, validateComment(true), commentController.updateComment)
  .delete(protect, validateIdParam, commentController.deleteComment);

module.exports = router;
