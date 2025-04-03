
import express  from "express"
import {  login , signup , logout, delete_user, update_profile, get_users, Check, VerifyOTP, resendOTP, resetPassword, password_Reset } from "../controllers/controller_auth.js";
import {authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";
 
const router = express.Router();

router.post("/signup" , signup);
router.post("/login" , login)
router.post("/logout" ,  authMiddleware, logout)
router.delete("/delete" , authMiddleware , delete_user)
router.post("/update/profile" , authMiddleware , upload.single("profilePic") , update_profile)
router.get("/profile/:userId" ,authMiddleware , upload.single("profilePic") , get_users)
router.post("/verify" , VerifyOTP)
router.post("/resend-otp" , resendOTP)
router.post("/reset-password" , resetPassword)
router.post("/password/reset/:token" , password_Reset)
 
 

router.get("/check" , authMiddleware ,Check)

export default router;
