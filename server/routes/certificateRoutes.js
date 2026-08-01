import express from "express";
import {
  fetchCertificates,
  createCertificate,
  removeCertificate
} from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", fetchCertificates);
router.post("/", protect, uploadSingle("image"), createCertificate);
router.delete("/:id", protect, removeCertificate);

export default router;