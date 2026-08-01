import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPasswordHash = (process.env.ADMIN_PASSWORD_HASH || "").trim();
    const jwtSecret = process.env.JWT_SECRET;

    // Ensure server is properly configured
    if (!adminEmail || !adminPasswordHash || !jwtSecret) {
      console.error("Missing required authentication environment variables.");

      return res.status(500).json({
        success: false,
        message: "Server configuration error.",
      });
    }

    // Verify email
    if (email.trim().toLowerCase() !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(
      password.trim(),
      adminPasswordHash
    );

    if (!isMatch) {
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
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};