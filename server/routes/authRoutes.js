import express from "express";

import { getCurrentUser, login, logout } from "../controllers/authController.js";
import { loginRateLimiter } from "../middleware/rateLimit.js";
import protect from "../middleware/authMiddleware.js";
import { getCsrfToken } from "../utils/authCookies.js";

const router = express.Router();

router.post("/login", loginRateLimiter, login);

router.get("/csrf", (req, res) => {
  const csrfToken = getCsrfToken(req);

  if (!csrfToken) {
    return res.status(401).json({
      success: false,
      message: "Authentication session is not initialized.",
    });
  }

  return res.status(200).json({ success: true, csrfToken });
});

router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);

export default router;
