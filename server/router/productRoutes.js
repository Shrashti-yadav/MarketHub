import express from "express";
import {
  createProduct,
  fetchAllProducts,
  updateProduct,
  deleteProduct,
  fetchSingleProduct,
  postProductReview,
  deleteReview,
  fetchAIFilteredProducts,
} from "../controllers/productController.js";
import {
  authorizedRoles,
  isAuthenticated,
  isAdminAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin routes — use isAdminAuthenticated
router.post(
  "/admin/create",
  isAdminAuthenticated,
  authorizedRoles("Admin"),
  createProduct
);
router.put(
  "/admin/update/:productId",
  isAdminAuthenticated,
  authorizedRoles("Admin"),
  updateProduct
);
router.delete(
  "/admin/delete/:productId",
  isAdminAuthenticated,
  authorizedRoles("Admin"),
  deleteProduct
);

// User routes — use isAuthenticated
router.get("/", fetchAllProducts);
router.get("/singleProduct/:productId", fetchSingleProduct);
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);
router.delete("/delete/review/:productId", isAuthenticated, deleteReview);
router.post("/ai-search", isAuthenticated, fetchAIFilteredProducts);

export default router;