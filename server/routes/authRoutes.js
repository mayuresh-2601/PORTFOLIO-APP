import express from "express";

import { login } from "../controllers/authController.js";

const router = express.Router();

/* 
   Authentication Routes
 */

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin user and return a JWT token
 * @access  Public
 */
router.post("/login", login);

/* 
   Future Routes
 */

/**
 * Future authentication routes can be added here.
 *
 * Example:
 *
 * router.post("/logout", logout);
 * router.get("/me", protect, getCurrentUser);
 * router.post("/refresh-token", refreshToken);
 * router.put("/change-password", protect, changePassword);
 */

export default router;