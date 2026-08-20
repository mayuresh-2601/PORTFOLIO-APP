import express from "express";

import { createMessage, fetchMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { contactRateLimiter } from "../middleware/rateLimit.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", contactRateLimiter, uploadSingle("file"), createMessage);
router.get("/", protect, fetchMessages);

export default router;
