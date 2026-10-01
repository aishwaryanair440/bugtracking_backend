// src/middleware/authMiddleware.js
// Protects routes by verifying the JWT sent in the Authorization header.
//
// How to use this on a route:
//   const { protect } = require('../middleware/authMiddleware');
//   router.get('/profile', protect, controller.getProfile);
//
// How to also restrict by role:
//   const { protect, requireRole } = require('../middleware/authMiddleware');
//   router.get('/faculty-only', protect, requireRole('faculty'), controller.someAction);

const { verifyToken } = require("../utils/jwt");

/**
 * protect middleware
 *
 * Reads the Authorization header, extracts the Bearer token,
 * verifies it using the JWT secret, and attaches the decoded user
 * to req.user so later route handlers know who is making the request.
 *
 * If the token is missing, malformed, expired, or invalid → HTTP 401
 */
const protect = (req, res, next) => {
  try {
    // 1. Read the Authorization header (e.g. "Bearer eyJhbGci...")
    const authHeader = req.headers["authorization"];

    // 2. Check that the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 3. Extract just the token part (everything after "Bearer ")
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 4. Verify the token — throws if invalid or expired
    const decoded = verifyToken(token);

    // 5. Attach the decoded payload to req.user so controllers can read it
    //    The payload contains: { id, role, iat, exp }
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    // 6. Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // Do NOT expose the real error message (e.g. "jwt expired") to the client
    // Log it server-side for debugging instead
    console.error("[Auth] Token verification failed:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

/**
 * requireRole middleware factory
 *
 * Returns a middleware that only allows users with the specified role.
 * Must be used AFTER protect, because it reads req.user.
 *
 * Usage:
 *   router.get('/faculty-area', protect, requireRole('faculty'), controller.fn);
 *
 * @param {string} role  - "faculty" or "student"
 */
const requireRole = (role) => {
  return (req, res, next) => {
    // req.user is set by the protect middleware above
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};

module.exports = { protect, requireRole };
