import toast from "react-hot-toast";

export const validateForm = (SignUp) => {
    if (!SignUp.name.trim()) return toast.error("Full name is required");
    if (!SignUp.email.trim()) return toast.error("Email is required");

    if (!/\S+@\S+\.\S+/.test(SignUp.email))
      return toast.error("Invalid email format");

    if (!SignUp.email.includes("@"))
      return toast.error("Email must contain '@'");
    if (!SignUp.email.endsWith("gmail.com"))
      return toast.error("Email must be a Gmail address (gmail.com)");

    if (!SignUp.password) return toast.error("Password is required");
    if (SignUp.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };