import express from "express";

import {
  createMessage,
  fetchMessages,
} from "../controllers/messageController.js";

import { protect } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* 
   Public Routes
 */

/**
 * @route   POST /api/messages
 * @desc    Submit a new contact message
 * @access  Public
 *
 * Supports:
 * - name
 * - email
 * - subject
 * - message
 * - optional file attachment
 */
router.post(
  "/",
  uploadSingle("file"),
  createMessage
);

/* 
   Protected Admin Routes
 */

/**
 * @route   GET /api/messages
 * @desc    Get all contact messages
 * @access  Private (Admin)
 */
router.get(
  "/",
  protect,
  fetchMessages
);

export default router;