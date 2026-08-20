import { addMessage, getMessages } from "../models/messageModel.js";
import sendEmail from "../utils/sendEmail.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createMessage = async (req, res, next) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const message = req.body?.message?.trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    if (name.length > 100 || email.length > 150 || message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const result = await addMessage({ name, email, message });

    try {
      await sendEmail({
        name,
        email,
        message,
        file: req.file,
      });
    } catch (emailError) {
      console.warn("Email notification failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      id: result.id,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchMessages = async (req, res, next) => {
  try {
    const messages = await getMessages();

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
