import path from "node:path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const allowedTypes = new Map([
  ["image/jpeg", ["jpg", "jpeg"]],
  ["image/png", ["png"]],
  ["image/webp", ["webp"]],
  ["application/pdf", ["pdf"]],
  ["application/msword", ["doc"]],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ["docx"],
  ],
]);

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const extension = path.extname(file.originalname).slice(1).toLowerCase();
    const safeExtension = extension || "bin";
    const safeBaseName = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || "upload";

    return {
      folder: `portfolio/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
      resource_type: "auto",
      public_id: `${Date.now()}-${safeBaseName}`,
      format: safeExtension,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const extensions = allowedTypes.get(file.mimetype);
  const extension = path.extname(file.originalname).slice(1).toLowerCase();

  if (extensions?.includes(extension)) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Unsupported file type. Allowed files: JPG, PNG, WEBP, PDF, DOC and DOCX."
    )
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
    fields: 20,
    fieldSize: 100 * 1024,
  },
});

export const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: "Maximum upload size is 10 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed.",
    });
  });
};

export default upload;
