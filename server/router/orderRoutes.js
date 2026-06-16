import express from "express";
import {
  fetchSingleOrder,
  placeNewOrder,
  fetchMyOrders,
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
} from "../controllers/orderController.js";
import {
  isAuthenticated,
  isAdminAuthenticated,
  authorizedRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes — isAuthenticated
router.post("/new", isAuthenticated, placeNewOrder);
router.get("/orders/me", isAuthenticated, fetchMyOrders);
router.put("/cancel/:orderId", isAuthenticated, cancelOrder);
router.get("/:orderId", isAuthenticated, fetchSingleOrder);

// Admin routes — isAdminAuthenticated
router.get(
  "/admin/getall",
  isAdminAuthenticated,
  authorizedRoles("Admin"),
  fetchAllOrders
);
router.put(
  "/admin/update/:orderId",
  isAdminAuthenticated,
  authorizedRoles("Admin"),
  updateOrderStatus
);
router.delete(
  "/admin/delete/:orderId",
  isAdminAuthenticated,
  authorizedRoles("Admin"),
  deleteOrder
);

export default router;