import express from "express";
import {
  forgotPassword,
  getUser,
  login,
  logout,
  adminLogout,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
} from "../controllers/authController.js";
import {
  isAuthenticated,
  isAdminAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", isAuthenticated, logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);
router.put("/profile/update", isAuthenticated, updateProfile);

// Admin routes
router.get("/admin/me", isAdminAuthenticated, getUser);
router.get("/admin/logout", isAdminAuthenticated, adminLogout); // ← added

export default router;