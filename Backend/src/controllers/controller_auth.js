import User from "../Models/User.js"
import { hashPassword } from "../utils/token.js";
import { tokenGenerates } from "../utils/token.js";
import { comparePassword } from "../utils/token.js";
import { uploadFromBuffer } from "../utils/buffer.js";
import crypto from "crypto"
import { sendOTP } from "../utils/sendOTP.js";
 
import { reset_password_link } from "../utils/Reset_password.js";
import { verifyToken } from "../utils/Decode.js";
import { token_for_reset } from "../utils/resetToken.js";

const tempUser = {};

export const signup = async(req,res) =>{
    try{
        const { name , email , password} = req.body;
        if(!name || !email || !password){
            return res.status(404).json({success : false , message : "all field are required"})
        }
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({success : false , message : "Invalid Credentials"})
        }
       
        const otp = crypto.randomInt(100000,999999)
        console.log(otp)

        tempUser[email] = {
            name,
            email,
            password : await hashPassword(password , 10),
            otp,
            otpExpiry : Date.now() + 2 * 60 * 1000
        }

        console.log(tempUser[email].otp)
        await sendOTP(email,otp)

        res.status(200).json({success : true , message : "OTP sent to email. Please verify to complete registration!"})

    }catch(error){
        console.log("Error from signup....")
        res.status(500).json({success : false , message : "Signup Failed !" , reason : error.massage})
    }
}

export const VerifyOTP = async(req,res) =>{

    try {
        const {email , otp} = req.body;

    if(!email || !otp){
        return res.status(404).json({
            success : false,
            message : "both are required"
        });
    }

    const tempuserdata = tempUser[email];

    if(!tempuserdata){
        return res.status(400).json({
            success : false,
            message : "OTP Expired or invalid request"
        })
    }

    if(tempuserdata.otpExpiry < Date.now()){
     delete tempUser[email].otp
          return res.status(400).json({ success: false, message: "OTP expired" });

    }

         if (tempuserdata.otp !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

              const newUser = new User({
            name: tempuserdata.name,
            email: tempuserdata.email,
            password: tempuserdata.password
        });
  
        tokenGenerates(newUser.id,res)
        await newUser.save();
        delete tempUser[email];

        res.status(201).json({ 
            success: true, 
            message: "User registered successfully", 
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.log("error from verify otp");
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            reason : error.message
        })
    }
    


}


export const resendOTP = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(404).json({
          success: false,
          message: "Email is required ",
        });
      }
  
      const otp = crypto.randomInt(100000, 999999);
   
   
      if (tempUser[email]) {
        tempUser[email].otp = otp;
        tempUser[email].otpExpiry = Date.now() + 2 * 60 * 1000; 
      } else {
        return res.status(400).json({
          success: false,
          message: "No user found with this email. Please sign up first.",
        });
      }
  
      await sendOTP(email, otp);
  
      res.status(200).json({
        success: true,
        message: `OTP has been sent to ${email}, please verify`,
      });
    } catch (error) {
      console.log("Error from resend OTP", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong!",
        reason: error.message,
      });
    }

};
export const resetPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Please provide an email address!",
        });
      }
  
      const is_Valid_User = await User.findOne({ email });
  
      if (!is_Valid_User) {
        return res.status(404).json({
          success: false,
          message: "Please signup.",
        });
      }
  
      const { _id: userId } = is_Valid_User;
      
  
      const token =  token_for_reset(userId);
       
      console.log(token)
  
      await reset_password_link(email, token);
  
      res.status(200).json({
        success: true,
        message: "Password reset link sent successfully.",
        token,
      });
    } catch (error) {
      console.log("Error in reset-password:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  export const password_Reset = async (req, res) => {
    try {
      const { token } = req.params;
  
      if (!token) {
        return res.status(404).json({
          success: false,
          message: "Access Denied! No token provided.",
        });
      }
  
      const { password } = req.body;
  
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "New password is required",
        });
      }
   
      let is_token_verified;
      try {
        is_token_verified = verifyToken(token);
      } catch (error) {
        console.log(error.message)
        }
       
      
  
      const userId = is_token_verified.userid;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
   
      user.password = await hashPassword(password, 10);
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Password reset successful.",
      });
    } catch (error) {
      console.log("Error from password reset:", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  };
  
  
  
export const login = async(req,res) => {
  

    try {
        const {email , password} = req.body;

    if(!email || !password){
        return res.status(404).json({success : false , message : "All field are required !"})
    }

    const existing_user = await User.findOne({email});

    if(!existing_user){
        return res.status(404).json({success : false , message : "Invalid Credentials "})
    }

    const validPassword = existing_user.password;
    const userId = existing_user._id;

    const comparedPassword = await comparePassword(password , validPassword )
   

    if(!comparedPassword){
        return res.status(404).json({success : false , message : "Invalid Credentials"})
    }

    tokenGenerates(userId,res)

    res.status(200).json({success : true , messsage : "login Successfull ! " , User : existing_user})

    } catch (error) {
        console.log("error from login..........")
        res.status(500).json({success : false  , message : "Failed to login" , reason : error.message})
    }
    

}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None", 
        });

        res.status(200).json({ success: true, message: "Logged out successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Logout failed", reason: error.message });
    }
};

export const delete_user = async (req, res) => {
    try {
       

        if(!req.user){
            return res.status(403).json({success : false , message : "Valid ni h gandu"})
        }
        const {password} = req.body;
        const loginId = req.user.id; 

       
       

        if (!loginId) {
            return res.status(400).json({ success: false, message: "No user ID found" });
        }
 


        const existing_user = await User.findById(loginId);
        if (!existing_user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const validPassword = existing_user.password;

        const isValid = await comparePassword(password , validPassword)
        

        if(!isValid){
            return res.status(403).json({message : "Access denied"})
        }
      

        await User.findByIdAndDelete(loginId);

        res.status(200).json({ success: true, message: "User deleted successfully!" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, reason: error.message });
    }
};

export const update_profile = async (req, res) => {
    try {
       
 
        const loginUser = req.user.id;
    
       

        if (!loginUser) {
            return res.status(400).json({ success: false, message: "Access Denied !" });
        }

         console.log(req.body)

        let uploadedPic = req.user.profilePic;

         console.log(uploadedPic)
        
        if(req.file){
            const result = await uploadFromBuffer(req.file.buffer);
            uploadedPic = result.secure_url;
        }


        const updatedUser = await User.findByIdAndUpdate(loginUser,
            { profilePic: uploadedPic },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            reason: error.message,
        });
    }
};

export const get_users = async (req, res) => {
    try {
        const { userId } = req.params;
         
       
        if(!req.user){
            return res.status(404).json({success : false , message : "Unauthorized user !"})
        }
        

        if (!userId || !loginUser) {
            return res.status(400).json({ success: false, message: "Something is missing" });
        }

        const user = await User.findById(userId).select("-password").lean();

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User retrieved successfully", user });

    } catch (error) {
        console.error("Error from get_users:", error.message);
        res.status(500).json({ success: false, message: "Something went wrong!", reason: error.message });
    }
};


export const Check = async(req,res) =>{
   if(!req.user){
    return res.status(404).json({success : false , message : "Unauthorized"})
   }

   const userid = req.user.id;
 

   const findUser = await User.findById(userid);

   res.status(200).json({message : "uesr found" , User :findUser})

   
}



