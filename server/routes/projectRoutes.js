import express from "express";
import {
  fetchProjects,
  createProject,
  removeProject,
  updateProjectById
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", fetchProjects);
router.post("/", protect, uploadSingle("image"), createProject);
router.put("/:id", protect, uploadSingle("image"), updateProjectById);
router.delete("/:id", protect, removeProject);

export default router;