// src/routes/authRoutes.js
// Defines all authentication-related routes.
//
// POST /api/auth/login          → Login (no auth required)
// POST /api/auth/logout         → Logout (no auth required — stateless JWT)
// GET  /api/auth/me             → Get current user (requires valid JWT)
// GET  /api/auth/protected-test → Test protected access (requires valid JWT)

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes (no JWT needed)
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes (JWT required — protect middleware runs first)
router.get("/me", protect, authController.getMe);
router.get("/protected-test", protect, authController.protectedTest);

module.exports = router;
