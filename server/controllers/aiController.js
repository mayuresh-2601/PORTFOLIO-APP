import {
  explainSkill,
  explainCertificate,
  answerAboutMe,
} from "../services/aiService.js";

export const explainSkillHandler = async (req, res) => {
  try {
    const { name, level } = req.body || {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Skill 'name' is required.",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Skill name is too long.",
      });
    }

    const explanation = await explainSkill(name.trim(), level);
    return res.status(200).json({ success: true, explanation });
  } catch (error) {
    console.error("AI explainSkill error:", error.message);
    return res.status(502).json({
      success: false,
      message: "AI explanation is temporarily unavailable.",
    });
  }
};

export const explainCertificateHandler = async (req, res) => {
  try {
    const { title, issuer } = req.body || {};

    if (!title || typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Certificate 'title' is required.",
      });
    }

    if (title.trim().length > 150 || (issuer && String(issuer).length > 150)) {
      return res.status(400).json({
        success: false,
        message: "Certificate details are too long.",
      });
    }

    const explanation = await explainCertificate(
      title.trim(),
      typeof issuer === "string" ? issuer.trim() : issuer
    );

    return res.status(200).json({ success: true, explanation });
  } catch (error) {
    console.error("AI explainCertificate error:", error.message);
    return res.status(502).json({
      success: false,
      message: "AI explanation is temporarily unavailable.",
    });
  }
};

export const askAboutMeHandler = async (req, res) => {
  try {
    const { question } = req.body || {};

    if (
      !question ||
      typeof question !== "string" ||
      question.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "'question' is required.",
      });
    }

    if (question.length > 300) {
      return res.status(400).json({
        success: false,
        message: "Question is too long (max 300 characters).",
      });
    }

    const answer = await answerAboutMe(question.trim());
    return res.status(200).json({ success: true, answer });
  } catch (error) {
    console.error("AI askAboutMe error:", error.message);
    return res.status(502).json({
      success: false,
      message: "AI assistant is temporarily unavailable.",
    });
  }
};
