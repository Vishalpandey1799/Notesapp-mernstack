import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/User.js";

 
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    

    if (!token) {
      return res.status(401).json({ status: false, message: "Unauthorized User" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    const userid = decoded.userid;

    const user = await User.findById(userid).select("-password");
 
 
    
    req.user = user;
    
    next();

  } catch (error) {
    return res.status(403).json({ status: false, message: "Invalid or Expired Token" });
  }
};
