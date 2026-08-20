import express from "express";
import {
  explainSkillHandler,
  explainCertificateHandler,
  askAboutMeHandler,
} from "../controllers/aiController.js";
import { aiRateLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/explain-skill", aiRateLimiter, explainSkillHandler);
router.post("/explain-certificate", aiRateLimiter, explainCertificateHandler);
router.post("/ask-about-me", aiRateLimiter, askAboutMeHandler);

export default router;
