import { Eye, EyeOff, Loader } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import useApiStore from "../StoreApi.js/ApiCall.js";
import { validateLogin } from "../utils/ValidateLogin.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { LoginUser, isLogin } = useApiStore();
  const [LoginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...LoginData, [name]: value });
  };

  const submitUser = async (e) => {
    e.preventDefault();
    const success = validateLogin(LoginData);

    if (!success) return toast.error("Login Failed!");

    await LoginUser(LoginData);
    setLoginData({ email: "", password: "" });
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-700 h-screen">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Welcome Back
        </h2>

        {/* Login Form */}
        <form onSubmit={submitUser} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-800 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={LoginData.email}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-gray-800 font-medium">
              Password
            </label>
            <input
              type={open ? "text" : "password"}
              placeholder="Enter your password"
              name="password"
              value={LoginData.password}
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

          {/* Forgot Password Link */}
          <p
            className="text-xs text-blue-600 text-right hover:underline cursor-pointer"
            onClick={() => navigate("/forget-password")}
          >
            Forgot Password?
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition-all flex items-center justify-center w-full"
          >
            {isLogin ? <Loader className="animate-spin w-5 h-5" /> : "Log In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-gray-600 text-sm text-center mt-4">
          Don't have an account?{" "}
          <button  className="text-blue-600 hover:underline" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
