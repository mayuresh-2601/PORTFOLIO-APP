import jwt from "jsonwebtoken";
import { getAuthToken } from "../utils/authCookies.js";

/*
   JWT Authentication Middleware

   The browser admin session is stored in an HttpOnly cookie instead of
   localStorage. This keeps the JWT inaccessible to client-side JavaScript.
*/
export const protect = (req, res, next) => {
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication is required.",
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
    const decoded = jwt.verify(token, jwtSecret, {
      issuer: "portfolio-api",
      audience: "portfolio-admin",
    });

    if (!decoded || typeof decoded !== "object" || decoded.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Authentication Error:", error.message);
    }

    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Authentication session has expired."
          : "Invalid authentication session.",
    });
  }
};

export default protect;
