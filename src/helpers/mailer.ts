import bcryptjs from "bcryptjs";
import { User } from "@/models/User";
import nodemailer from "nodemailer";
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      const hashedTokenPassword = await bcryptjs.hash(userId.toString(), 10);
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "4f2948c18e1164",
        pass: "aade3dcdd8d02e",
      },
    });
    const mailOptions = {
      from: "hetanshujshah@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password", // Subject line

      html: `
           <p> Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to $ 
            {emailType==="VERIFY" ? "verify your email":"Reset your Password"} or copy and paste the link below in your browser.<br>
            ${process.env.DOMAIN}/Verfifyemail?token=${hashedToken}
           </p> `,
    };
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
