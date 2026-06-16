import express from "express";
import { getAllUsers, deleteUser, dashboardStats } from "../controllers/adminController.js";
import {
  authorizedRoles,
  isAdminAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/getallusers",
  isAdminAuthenticated,
  authorizedRoles("Admin"),
  getAllUsers
);
router.delete(
  "/delete/:id",
  isAdminAuthenticated,
  authorizedRoles("Admin"),
  deleteUser
);
router.get(
  "/fetch/dashboard-stats",
  isAdminAuthenticated,
  authorizedRoles("Admin"),
  dashboardStats
);

export default router;