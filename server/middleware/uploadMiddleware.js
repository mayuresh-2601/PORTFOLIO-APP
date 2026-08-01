import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "portfolio/uploads",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf", "doc", "docx"],
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadSingle = (fieldName) => (req, res, next) => {
  const handler = upload.single(fieldName);
  handler(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Upload failed",
      });
    }
    next();
  });
};

export default upload;