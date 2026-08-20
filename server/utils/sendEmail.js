import nodemailer from "nodemailer";


// Create Transporter


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Send Contact Email


const sendEmail = async (messageData) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email configuration is missing. Check EMAIL_USER and EMAIL_PASS."
    );
  }

  const {
    name = "Unknown",
    email = "Not Provided",
    subject = "Portfolio Contact Form",
    message = "",
    file,
  } = messageData;

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    replyTo: email,
    subject: `📩 ${subject}`,

    text: `
New Portfolio Contact Message

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Submitted At:
${new Date().toLocaleString()}
`,

    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2>📩 New Portfolio Contact Message</h2>

        <table cellpadding="8" cellspacing="0">
          <tr>
            <td><strong>Name</strong></td>
            <td>${name}</td>
          </tr>

          <tr>
            <td><strong>Email</strong></td>
            <td>${email}</td>
          </tr>

          <tr>
            <td><strong>Subject</strong></td>
            <td>${subject}</td>
          </tr>

          <tr>
            <td><strong>Submitted</strong></td>
            <td>${new Date().toLocaleString()}</td>
          </tr>
        </table>

        <h3>Message</h3>

        <p>${message.replace(/\n/g, "<br>")}</p>
      </div>
    `,

    attachments: file
      ? [
          {
            filename: file.originalname,
            path: file.path,
          },
        ]
      : [],
  };

  try {
    await transporter.verify();

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Email Error:", error);

    throw error;
  }
};

export default sendEmail;