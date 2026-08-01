import nodemailer from "nodemailer";

const sendEmail = async (messageData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Message from ${messageData.name}`,
      text: `Name: ${messageData.name}\nEmail: ${messageData.email}\nMessage: ${messageData.message}`,
      replyTo: messageData.email,
      attachments: messageData.file
        ? [{ filename: messageData.file.originalname, path: messageData.file.path }]
        : [],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

export default sendEmail;