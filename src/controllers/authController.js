// src/controllers/authController.js
// Handles all authentication HTTP requests.
// Controllers are kept thin — they validate input, call the service, and send responses.
// All database logic lives in authService.js.

const { findUserByEmail, verifyPassword, getUserById } = require("../services/authService");
const { generateToken } = require("../utils/jwt");

const authController = {

  // ── POST /api/auth/login ────────────────────────────────────────────────────
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // ── 1. Input validation ─────────────────────────────────────────────────
      // Both fields must be present and non-empty
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Basic email format check (must contain @ and .)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      // ── 2. Find the user in FACULTY or STUDENT table ────────────────────────
      const result = await findUserByEmail(email.trim().toLowerCase());

      // Generic error — do NOT tell the client whether the email exists
      if (!result) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const { user, role } = result;

      // ── 3. Compare submitted password with the stored bcrypt hash ───────────
      const passwordMatch = await verifyPassword(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // ── 4. Generate JWT ─────────────────────────────────────────────────────
      // Only put the minimum needed info in the token (id + role)
      const token = generateToken({ id: user.id, role });

      // ── 5. Send response — NEVER include the password or hash ───────────────
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role,
          },
          token,
        },
      });
    } catch (error) {
      // Pass unexpected errors to the global error handler
      next(error);
    }
  },

  // ── POST /api/auth/logout ───────────────────────────────────────────────────
  // JWT is stateless — the server cannot forcibly invalidate a token.
  // The frontend is responsible for deleting the stored token on logout.
  logout: (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Logout successful. Please delete your token on the client side.",
    });
  },

  // ── GET /api/auth/me ────────────────────────────────────────────────────────
  // Returns the currently authenticated user's info.
  // Requires the protect middleware — req.user is already set by that point.
  getMe: async (req, res, next) => {
    try {
      // req.user.id and req.user.role are set by the protect middleware
      const user = await getUserById(req.user.id, req.user.role);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Return fresh data from the database (not just what's in the token)
      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // ── GET /api/auth/protected-test ────────────────────────────────────────────
  // A simple test route to confirm that JWT authentication is working.
  // Requires the protect middleware.
  protectedTest: (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Authenticated request successful",
      user: req.user, // { id, role } from the verified JWT
    });
  },
};

module.exports = authController;
