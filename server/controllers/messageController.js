import { addMessage, getMessages } from "../models/messageModel.js";
import sendEmail from "../utils/sendEmail.js";

export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await addMessage({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    try {
      await sendEmail({ name, email, message, file: req.file });
    } catch (emailErr) {
      console.warn("Email warning:", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send message" });
  }
};

export const fetchMessages = async (req, res) => {
  try {
    const messages = await getMessages();
    return res.status(200).json(messages || []);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};