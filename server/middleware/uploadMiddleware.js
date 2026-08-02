import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


// Allowed MIME Types


const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];


// Cloudinary Storage


const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: `portfolio/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
    resource_type: "auto",

    public_id: `${Date.now()}-${file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_.]/g, "")}`,

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "pdf",
      "doc",
      "docx",
    ],
  }),
});


// File Filter


const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Unsupported file type. Only JPG, PNG, WEBP, PDF, DOC and DOCX files are allowed."
    )
  );
};


// Multer Instance


const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});


// Single File Upload Middleware


export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) {
        return next();
      }

      console.error("Upload Error:", err);

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
};

export default upload;