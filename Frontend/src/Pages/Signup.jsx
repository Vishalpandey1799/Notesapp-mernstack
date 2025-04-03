import { Eye, EyeOff, Loader } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaGoogle, FaGithub } from "react-icons/fa";
import useApiStore from "../StoreApi.js/ApiCall.js";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../utils/ValidateForm.js";

const Signup = () => {
  const navigate = useNavigate();
  const { NewUser, isSignup } = useApiStore();
  const [open, setOpen] = useState(false);
  const [SignUp, setSignUp] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    let strength = { score: score * 25, label: "", color: "" };

    if (score === 0) strength = { score: 0, label: "", color: "bg-gray-700" };
    else if (score === 1)
      strength = { score: 25, label: "Weak", color: "bg-red-500" };
    else if (score === 2)
      strength = { score: 50, label: "Fair", color: "bg-yellow-500" };
    else if (score === 3)
      strength = { score: 75, label: "Good", color: "bg-blue-500" };
    else if (score === 4)
      strength = { score: 100, label: "Strong", color: "bg-green-500" };

    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUp({
      ...SignUp,
      [name]: value,
    });

    if (name === "password") checkPasswordStrength(value);
  };

  const submitUser = async (e) => {
    e.preventDefault();

    const success = validateForm(SignUp);

    if (!success) return toast.error("Sign Up Failed !");
    await NewUser(SignUp);
    navigate("/otp", { state: { email: SignUp.email } });

    setSignUp({ name: "", email: "", password: "" });
    setPasswordStrength({ score: 0, label: "", color: "" });
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-700 h-screen">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Create Your Account
        </h2>

        <form onSubmit={submitUser} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className="text-gray-800 font-medium">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              name="name"
              value={SignUp.name}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-800 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={SignUp.email}
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
              value={SignUp.password}
              onChange={handleChange}
              required
              className="p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-600"
              onClick={() => setOpen(!open)}
            >
              {open ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {/* Password Strength Meter */}
            {SignUp.password && (
              <div className="mt-2">
                <div className="h-2 w-full rounded bg-gray-300">
                  <div
                    className={`h-full rounded transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1 text-center">
                  {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition-all flex items-center justify-center w-full"
          >
            {isSignup ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin w-5 h-5" />
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
 

        {/* Login Link */}
        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{" "}
          <button  className="text-blue-600 hover:underline" onClick={() => navigate("/login")}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
