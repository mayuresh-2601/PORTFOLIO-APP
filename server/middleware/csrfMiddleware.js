import crypto from "node:crypto";
import { getAuthToken, getCsrfToken } from "../utils/authCookies.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  if (
    req.path === "/auth/login" ||
    req.path === "/auth/csrf" ||
    req.path.startsWith("/messages") ||
    req.path.startsWith("/ai")
  ) return next();

  // Only cookie-authenticated requests need CSRF protection. Public endpoints
  // do not receive an authentication cookie and therefore cannot be abused
  // through ambient admin credentials.
  if (!getAuthToken(req)) return next();

  const cookieToken = getCsrfToken(req);
  const headerToken = req.get("x-csrf-token");

  if (!cookieToken || !headerToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed.",
    });
  }

  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);

  if (
    cookieBuffer.length !== headerBuffer.length ||
    !crypto.timingSafeEqual(cookieBuffer, headerBuffer)
  ) {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed.",
    });
  }

  return next();
};
