import express from "express";
import {
  fetchSkills,
  createSkill,
  removeSkill
} from "../controllers/skillController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", fetchSkills);
router.post("/", protect, createSkill);
router.delete("/:id", protect, removeSkill);

export default router;