import { create } from "zustand";
import axios from "axios";
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api/auth"
    : "/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (name, email, phone, dob, password, gender) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        phone,
        dob,
        password,
        gender,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

 login: async ({ email, phone, password }) => {
  set({ isLoading: true, error: null });

  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      phone,
      password,
    });

    set({
      isAuthenticated: true,
      user: response.data.user,
      isLoading: false,
      error: null,
    });

    return response.data;
  } catch (error) {
    set({
      error: error.response?.data?.message || "Error logging in",
      isLoading: false,
    });
    throw error;
  }
},

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
 verifyEmail: async (code) => {
  set({ isLoading: true, error: null });

  try {
    const res = await axios.post(
      `${API_URL}/verify-email`,
      { code },
      { withCredentials: true }
    );

    set({
      user: res.data.user,
      isAuthenticated: true, // ✔ only if backend sets auth cookie here
      isLoading: false,
    });

    return res.data;
  } catch (err) {
    set({
      error:
        err?.response?.data?.message ||
        "Invalid or expired verification code",
      isLoading: false,
    });
    throw err;
  }
},

  checkAuth: async () => {
    // await new Promise((resolve) => {setTimeout(resolve,3000);})
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
