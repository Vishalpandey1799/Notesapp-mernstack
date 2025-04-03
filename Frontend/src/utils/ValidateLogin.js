
import toast from "react-hot-toast";

export const validateLogin = (LoginData) => {
    if (!LoginData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(LoginData.email))
      return toast.error("Invalid email format");

    if (!LoginData.password) return toast.error("Password is required");
    return true;
  };