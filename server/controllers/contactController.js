// controllers/contactController.js

import { sendEmail } from "../utils/sendEmail.js";

export const contactUs = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const emailMessage = `
      <h2>New Contact Form Submission</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>

      <h3>Message</h3>
      <p>${message}</p>
    `;

    await sendEmail({
      email: "markethubsupport@gmail.com",
      subject: `Contact Form: ${subject}`,
      message: emailMessage,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};