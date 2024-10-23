import nodemailer from "nodemailer";

export default async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });
  const mailOptions = {
    from: `"YourApp Support" <${process.env.EMAIL_USER}>`,  // Use environment variable for sender email
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>For any questions or issues, please contact our support team.</p>
        <p>Thank you,</p>
        <p>YourApp Support</p>
      </div>
    `,
  };
  

  await transporter.sendMail(mailOptions);
}
