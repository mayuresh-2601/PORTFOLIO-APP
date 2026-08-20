// server/routes/aiRoutes.js
import express from "express";
import {
  explainSkillHandler,
  explainCertificateHandler,
  askAboutMeHandler,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/explain-skill", explainSkillHandler);
router.post("/explain-certificate", explainCertificateHandler);
router.post("/ask-about-me", askAboutMeHandler);

export default router;
