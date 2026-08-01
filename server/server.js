import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import {
  errorHandler,
  notFound,
} from "./middleware/errorMiddleware.js";

const app = express();

// ========================================
// Validate Required Environment Variables
// ========================================

const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD_HASH",
];

const missing = requiredEnv.filter(
  (key) => !process.env[key]
);

if (missing.length) {
  console.error(
    `Missing environment variables: ${missing.join(", ")}`
  );
  process.exit(1);
}

// ========================================
// Global Middleware
// ========================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ========================================
// Health Check
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API Backend is running.",
  });
});

// ========================================
// API Routes
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/messages", messageRoutes);

// ========================================
// Error Middleware
// ========================================

app.use(notFound);
app.use(errorHandler);

// ========================================
// Start Server
// ========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.execute("SELECT 1");

    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to connect to database.");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();