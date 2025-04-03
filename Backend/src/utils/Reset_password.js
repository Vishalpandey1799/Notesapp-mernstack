import dotenv from "dotenv";
 
dotenv.config({})

import nodemailer from "nodemailer";

export const reset_password_link = async(email,token) =>{
 try {
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        secure : false,
        auth :{
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASSWORD,
        },

        tls : {
            rejectUnauthorized : false
        }
    });

    const mailOptions = {
        from: `"WriteLT" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔐 Password Reset Request - WriteLT",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; text-align: center; background-color: #f9f9f9;">
          <h2 style="color: #333;">🔐 Reset Your Password</h2>
          <p style="color: #555;">We received a request to reset your password. Click the link below to create a new password. This link is valid for <strong>10 minutes</strong>.</p>
          <div style="background-color: #ffffff; border: 2px dashed #007BFF; padding: 15px; font-size: 18px; font-weight: bold; color: #007BFF; letter-spacing: 2px; display: inline-block;">
            <a href="${process.env.FRONTEND_URL}/reset-password/${token}" style="color: #007BFF; text-decoration: none;">Reset Your Password</a>
          </div>
          <p style="color: #777; font-size: 14px; margin-top: 10px;">If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 13px; color: #999;">© ${new Date().getFullYear()} WriteLT. All rights reserved.</p>
        </div>
        `,
    };
    

    await transporter.sendMail(mailOptions)
    
 } catch (error) {
    console.log("error from reset password link" , error.message)
 }
}