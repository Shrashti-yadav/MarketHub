import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import database from "../database/db.js";

export const addToWishlist = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    return next(new ErrorHandler("Please provide a product ID.", 400));
  }

  // Check product exists
  const product = await database.query(
    "SELECT id FROM products WHERE id = $1",
    [productId]
  );
  if (product.rows.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Check already wishlisted
  const existing = await database.query(
    "SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2",
    [userId, productId]
  );
  if (existing.rows.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Product already in wishlist.",
    });
  }

  await database.query(
    "INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)",
    [userId, productId]
  );

  res.status(200).json({
    success: true,
    message: "Added to wishlist.",
  });
});

export const getWishlist = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const result = await database.query(
    `SELECT p.*
     FROM wishlist w
     JOIN products p ON p.id = w.product_id
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC`,
    [userId]
  );

  res.status(200).json({
    success: true,
    wishlist: result.rows,
  });
});

export const removeFromWishlist = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const result = await database.query(
    "DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2 RETURNING *",
    [userId, productId]
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler("Product not found in wishlist.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Removed from wishlist.",
  });
});
