import jwt from "jsonwebtoken";

/* 
   JWT Authentication Middleware
 */

/**
 * Protect routes using JWT authentication.
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ------------------------------------------
  // Validate Authorization Header
  // ------------------------------------------
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required.",
    });
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required.",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET environment variable is missing.");

    return res.status(500).json({
      success: false,
      message: "Server configuration error.",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded || typeof decoded !== "object") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.user = decoded;

    return next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Authentication Error:", error);
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default protect;