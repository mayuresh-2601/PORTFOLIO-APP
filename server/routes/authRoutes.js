import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

// ===========================
// Authentication Routes
// ===========================

// Admin Login
router.post("/login", login);

export default router;