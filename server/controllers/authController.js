import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* 
   Admin Login
 */

export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "")
      .trim()
      .toLowerCase();

    const adminPasswordHash = (
      process.env.ADMIN_PASSWORD_HASH || ""
    ).trim();

    const jwtSecret = process.env.JWT_SECRET;

    const jwtExpiry =
      process.env.JWT_EXPIRES_IN || "7d";

    // Validate environment variables
    if (!adminEmail || !adminPasswordHash || !jwtSecret) {
      console.error(
        "Authentication environment variables are missing."
      );

      return res.status(500).json({
        success: false,
        message: "Server configuration error.",
      });
    }

    // Verify email
    if (email !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(
      password,
      adminPasswordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        email: adminEmail,
        role: "admin",
      },
      jwtSecret,
      {
        expiresIn: jwtExpiry,
        issuer: "portfolio-api",
        audience: "portfolio-admin",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      expiresIn: jwtExpiry,
      user: {
        email: adminEmail,
        role: "admin",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Login Error:", error);
    }

    next(error);
  }
};