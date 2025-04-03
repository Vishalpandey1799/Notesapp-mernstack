import React, { useState } from "react";
import toast from "react-hot-toast";
import useApiStore from "../StoreApi.js/ApiCall.js";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { password_Reset } = useApiStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter a valid email address.");
    }

    try {
      setIsLoading(true);
      await password_Reset(email);  
      toast.success("Password reset link has been sent to your email.");
       
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-700 h-screen">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address below and we will send you a link to reset
          your password.
        </p>
 
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-800 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition-all flex items-center justify-center w-full"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

       
        <p className="text-gray-600 text-sm text-center mt-4">
          Remember your password?{" "}
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

export default ForgotPassword;
