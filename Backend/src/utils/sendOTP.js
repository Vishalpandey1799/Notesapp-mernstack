import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,  
      port: process.env.EMAIL_PORT,
      secure: false,   
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,   
      },
    });

    const mailOptions = {
        from: `"Writelt" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔐 Your OTP for Signup - WriteLT",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; text-align: center; background-color: #f9f9f9;">
          <h2 style="color: #333;">🔐 Verify Your Email</h2>
          <p style="color: #555;">Use the OTP below to complete your signup process. This code is valid for <strong>5 minutes</strong>.</p>
          <div style="background-color: #ffffff; border: 2px dashed #007BFF; padding: 15px; font-size: 22px; font-weight: bold; color: #007BFF; letter-spacing: 2px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #777; font-size: 14px; margin-top: 10px;">Didn't request this code? Ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 13px; color: #999;">© ${new Date().getFullYear()} WriteLT. All rights reserved.</p>
        </div>
        `,
      };
      

    await transporter.sendMail(mailOptions);
   
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Please try again.");
  }
};
