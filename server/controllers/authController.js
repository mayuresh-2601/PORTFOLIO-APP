import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { clearAuthCookies, setAuthCookies } from "../utils/authCookies.js";

export const login = async (req, res, next) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!email || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (email.length > 150 || password.length > 256) {
      return res.status(400).json({
        success: false,
        message: "Invalid login details.",
      });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPasswordHash = (process.env.ADMIN_PASSWORD_HASH || "").trim();
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiry = process.env.JWT_EXPIRES_IN || "7d";

    if (!adminEmail || !adminPasswordHash || !jwtSecret) {
      console.error("Authentication environment variables are missing.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error.",
      });
    }

    const emailMatches = email === adminEmail;
    const passwordMatch = emailMatches
      ? await bcrypt.compare(password, adminPasswordHash)
      : false;

    if (!emailMatches || !passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { email: adminEmail, role: "admin" },
      jwtSecret,
      {
        expiresIn: jwtExpiry,
        issuer: "portfolio-api",
        audience: "portfolio-admin",
      }
    );

    const csrfToken = setAuthCookies(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      expiresIn: jwtExpiry,
      csrfToken,
      user: {
        email: adminEmail,
        role: "admin",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Login Error:", error.message);
    }
    next(error);
  }
};

export const getCurrentUser = (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      email: req.user.email,
      role: req.user.role,
    },
  });
};

export const logout = (req, res) => {
  clearAuthCookies(res);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
