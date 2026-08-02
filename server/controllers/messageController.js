import { addMessage, getMessages } from "../models/messageModel.js";
import sendEmail from "../utils/sendEmail.js";

/* 
   Create Contact Message
 */

export const createMessage = async (req, res, next) => {
  try {
    let { name, email, message } = req.body;

    name = name?.trim();
    email = email?.trim();
    message = message?.trim();

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    // Validate email format
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Save message to database
    const result = await addMessage({
      name,
      email,
      message,
    });

    // Send email notification (non-blocking)
    try {
      await sendEmail({
        name,
        email,
        message,
        file: req.file,
      });
    } catch (emailError) {
      console.warn(
        "Email notification failed:",
        emailError.message
      );
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

/* 
   Get All Messages
 */

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