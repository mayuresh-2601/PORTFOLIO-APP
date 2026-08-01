import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Trim whitespace and lower-case both inputs for comparison
    const inputEmail = email.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

    if (inputEmail !== envAdminEmail) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(
      password.trim(),
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: envAdminEmail, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};