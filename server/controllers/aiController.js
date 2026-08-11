// server/controllers/aiController.js
import { explainSkill, explainCertificate, answerAboutMe } from "../services/aiService.js";

// Very small in-memory rate limiter keyed by IP, since this endpoint calls a
// paid external API and is public. Resets every minute. Good enough for a
// portfolio site's traffic level — a real product would use Redis.
const requestLog = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}

export const explainSkillHandler = async (req, res) => {
  try {
    if (isRateLimited(req.ip)) {
      return res.status(429).json({ success: false, message: "Too many requests. Try again in a minute." });
    }

    const { name, level } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ success: false, message: "Skill 'name' is required." });
    }

    const explanation = await explainSkill(name.slice(0, 100), level);
    res.status(200).json({ success: true, explanation });
  } catch (error) {
    console.error("AI explainSkill error:", error.message);
    res.status(502).json({ success: false, message: "AI explanation is temporarily unavailable." });
  }
};

export const explainCertificateHandler = async (req, res) => {
  try {
    if (isRateLimited(req.ip)) {
      return res.status(429).json({ success: false, message: "Too many requests. Try again in a minute." });
    }

    const { title, issuer } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ success: false, message: "Certificate 'title' is required." });
    }

    const explanation = await explainCertificate(title.slice(0, 150), issuer);
    res.status(200).json({ success: true, explanation });
  } catch (error) {
    console.error("AI explainCertificate error:", error.message);
    res.status(502).json({ success: false, message: "AI explanation is temporarily unavailable." });
  }
};

export const askAboutMeHandler = async (req, res) => {
  try {
    if (isRateLimited(req.ip)) {
      return res.status(429).json({ success: false, message: "Too many requests. Try again in a minute." });
    }

    const { question } = req.body;
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({ success: false, message: "'question' is required." });
    }
    if (question.length > 300) {
      return res.status(400).json({ success: false, message: "Question is too long (max 300 characters)." });
    }

    const answer = await answerAboutMe(question.trim());
    res.status(200).json({ success: true, answer });
  } catch (error) {
    console.error("AI askAboutMe error:", error.message);
    res.status(502).json({ success: false, message: "AI assistant is temporarily unavailable." });
  }
};
