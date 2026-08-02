/**

 * Global Error Handling Middleware

 */

/**
 * Handles all application errors.
 */
export const errorHandler = (err, req, res, next) => {
  // If headers are already sent, let Express handle it.
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  // Log detailed information during development
  if (process.env.NODE_ENV !== "production") {
    console.error("========================================");
    console.error("Error:", err.message);
    console.error("Method:", req.method);
    console.error("URL:", req.originalUrl);
    console.error(err.stack);
    console.error("========================================");
  } else {
    console.error(err.message);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
    stack:
      process.env.NODE_ENV === "production"
        ? undefined
        : err.stack,
  });
};

/**

 * 404 Not Found Middleware

 */

/**
 * Handles unknown routes.
 */
export const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};