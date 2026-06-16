import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
  },

  reducers: {
    loginRequest(state) { state.loading = true; },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginFailed(state) { state.loading = false; },

    getUserRequest(state) { state.loading = true; },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    logoutRequest(state) { state.loading = true; },
    logoutSuccess(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFailed(state) { state.loading = false; },

    forgotPasswordRequest(state) { state.loading = true; },
    forgotPasswordSuccess(state) { state.loading = false; },
    forgotPasswordFailed(state) { state.loading = false; },

    resetPasswordRequest(state) { state.loading = true; },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    resetPasswordFailed(state) { state.loading = false; },

    updateProfileRequest(state) { state.loading = true; },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    updateProfileFailed(state) { state.loading = false; },

    updatePasswordRequest(state) { state.loading = true; },
    updatePasswordSuccess(state) { state.loading = false; },
    updatePasswordFailed(state) { state.loading = false; },

    resetAuthSlice(state) { state.loading = false; },
  },
});

// LOGIN
export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  try {
    const res = await axiosInstance.post("/auth/login", data);
    if (res.data.user.role === "Admin") {
      dispatch(authSlice.actions.loginSuccess(res.data.user));
      toast.success(res.data.message);
    } else {
      dispatch(authSlice.actions.loginFailed());
      toast.error("Access denied. Admins only.");
    }
  } catch (error) {
    dispatch(authSlice.actions.loginFailed());
    toast.error(error.response?.data?.message || "Login failed");
  }
};

// GET USER — FIX: use /auth/admin/me to read admin_token cookie
export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  try {
    const res = await axiosInstance.get("/auth/admin/me"); // ← changed
    dispatch(authSlice.actions.getUserSuccess(res.data.user));
  } catch (error) {
    dispatch(authSlice.actions.getUserFailed());
  }
};

// LOGOUT — FIX: use /auth/admin/logout to clear admin_token cookie
export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  try {
    const res = await axiosInstance.get("/auth/admin/logout"); // ← changed
    dispatch(authSlice.actions.logoutSuccess());
    toast.success(res.data.message);
    dispatch(authSlice.actions.resetAuthSlice());
  } catch (error) {
    dispatch(authSlice.actions.logoutFailed());
    toast.error(error.response?.data?.message || "Logout failed.");
    dispatch(authSlice.actions.resetAuthSlice());
  }
};

// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());
  try {
    const res = await axiosInstance.post(
      "/auth/password/forgot?frontendUrl=http://localhost:5174",
      { email }
    );
    dispatch(authSlice.actions.forgotPasswordSuccess());
    toast.success(res.data.message);
  } catch (error) {
    dispatch(authSlice.actions.forgotPasswordFailed());
    toast.error(error.response?.data?.message || "Cannot request for reset password");
  }
};

// RESET PASSWORD
export const resetPassword = (newData, token) => async (dispatch) => {
  dispatch(authSlice.actions.resetPasswordRequest());
  try {
    const res = await axiosInstance.put(`/auth/password/reset/${token}`, newData);
    dispatch(authSlice.actions.resetPasswordSuccess(res.data.user));
    toast.success(res.data.message);
  } catch (error) {
    dispatch(authSlice.actions.resetPasswordFailed());
    toast.error(error.response?.data?.message || "Failed to reset password");
  }
};

// UPDATE PROFILE
export const updateAdminProfile = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updateProfileRequest());
  try {
    const res = await axiosInstance.put("/auth/profile/update", data);
    dispatch(authSlice.actions.updateProfileSuccess(res.data.user));
    toast.success(res.data.message);
  } catch (error) {
    dispatch(authSlice.actions.updateProfileFailed());
    toast.error(error.response?.data?.message || "Failed to update profile");
  }
};

// UPDATE PASSWORD
export const updateAdminPassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  try {
    const res = await axiosInstance.put("/auth/password/update", data);
    dispatch(authSlice.actions.updatePasswordSuccess());
    toast.success(res.data.message);
  } catch (error) {
    dispatch(authSlice.actions.updatePasswordFailed());
    toast.error(error.response?.data?.message || "Failed to update password.");
  }
};

export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

export default authSlice.reducer;