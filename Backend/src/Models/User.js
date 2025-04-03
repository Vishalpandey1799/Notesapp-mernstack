import mongoose from "mongoose";

// user ke liye h bhaii 
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 
        "Please enter a valid email address"
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${this.name}`;
      }
    },
   
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
