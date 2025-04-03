import { create } from "zustand";
import { axiosInstance } from "../utils/Axios.js";
import toast from "react-hot-toast";

const useApiStore = create((set, get) => ({
  isLogin: false,
  isSignup: false,
  currentUser: null,
  isProfileUpdating: false,
  isLoading: true,
  isVerify: false,
  token: null,
  

  NewUser: async (data) => {
    try {
      set({ isSignup: true });
      const response = await axiosInstance.post("/signup", data);
      toast.success(response.data.message);
      set({ isSignup: false });
    } catch (error) {
      set({ isSignup: false });
      const message = error.response?.data?.message || "Sign Up Failed!";
      toast.error(message);
    }
  },

  VerifyUser: async (email, otp) => {
    try {
      set({ isVerify: true });
      const response = await axiosInstance.post("/verify", { email, otp });
     
      toast.success(response?.data?.message);
      set({ currentUser: response.data.user, isSignup: false, isVerify: false });
      return response.data;
    } catch (error) {
      set({ isVerify: false });
      
      toast.error(error.response?.data?.message);
    }
  },

  LoginUser: async (data) => {
    try {
      set({ isLogin: true });
      const response = await axiosInstance.post("/login", data);
      set({ currentUser: response.data.User, isLogin: false });
      toast.success("Login Successful!");
    } catch (error) {
      set({ isLogin: false });
      const errMsg = error.response?.data?.message || "Login Failed!";
      toast.error(errMsg);
    }
  },

  validUser: async () => {
    try {
      const response = await axiosInstance.get("/check");
      set({ currentUser: response.data.User, isLoading: false });
    } catch (error) {
      set({ currentUser: null, isLoading: false });
    }
  },

  LogoutUser: async () => {
    await axiosInstance.post("/logout");
    set({ currentUser: null });
  },

  profileUpdate: async (file) => {
    try {
      set({ isProfileUpdating: true });
       
      const formData = new FormData();
      formData.append("profilePic", file);
      const response = await axiosInstance.post("/update/profile", formData , {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
     
      set({ isProfileUpdating: false });
      toast.success("Profile Updated!");
    } catch (error) {
      set({ isProfileUpdating: false });
      toast.error(error.response?.data?.message || "Profile Update Failed!");
    }
  },

  accountDelete: async (password) => {
    await axiosInstance.delete("/delete", {
      data: { password },
    });
    set({ currentUser: null });
  },

  password_Reset: async (email) => {
    try {
      const response = await axiosInstance.post("/reset-password", { email });
      set({ token: response.data?.token });
      toast.success(response?.data?.message)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  },

  reset_password: async (token, password) => {
    try {
      const response = await axiosInstance.post(`/password/reset/${token}`, { password });
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error("Your link is expired!");
    }
  },
 

}));

export default useApiStore;
