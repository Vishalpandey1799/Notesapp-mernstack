import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Loader } from "lucide-react";
import useApiStore from "../StoreApi.js/ApiCall.js";

const NewPassword = () => {
  const { token } = useParams();
  const { reset_password } = useApiStore();
 
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
 

  const handleChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }
    setIsSubmitting(true);
    await reset_password(token, newPassword);
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-700 h-screen">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Set a New Password
        </h2>

 
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* New Password */}
          <div className="flex flex-col relative">
            <label htmlFor="newPassword" className="text-gray-800 font-medium">
              New Password
            </label>
            <input
              type={open ? "text" : "password"}
              placeholder="Enter your new password"
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-600"
              onClick={() => setOpen(!open)}
            >
              {open ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
 
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition-all flex items-center justify-center w-full"
          >
            {isSubmitting ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : (
              "Set New Password"
            )}
          </button>
        </form>

        
        <p className="text-gray-600 text-sm text-center mt-4">
          Remembered your password?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default NewPassword;
