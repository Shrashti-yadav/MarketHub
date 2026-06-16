import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import Stripe from "stripe";

import { createTables } from "./utils/createTables.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

import authRouter from "./router/authRoutes.js";
import productRouter from "./router/productRoutes.js";
import adminRouter from "./router/adminRoutes.js";
import orderRouter from "./router/orderRoutes.js";
import contactRouter from "./router/contactRoutes.js";
import wishlistRouter from "./router/wishlistRoutes.js";
import database from "./database/db.js";

config({ path: "./config/config.env" });

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 


app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.DASHBOARD_URL || "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      try {
        const updatedPaymentStatus = "Paid";

        const result = await database.query(
          `UPDATE payments 
           SET payment_status = $1 
           WHERE payment_intent_id = $2 
           RETURNING *`,
          [updatedPaymentStatus, paymentIntent.id]
        );

        if (!result.rows.length) return res.sendStatus(200);

        const orderId = result.rows[0].order_id;

        await database.query(
          `UPDATE orders SET paid_at = NOW() WHERE id = $1`,
          [orderId]
        );

        const { rows: items } = await database.query(
          `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
          [orderId]
        );

        for (const item of items) {
          await database.query(
            `UPDATE products 
             SET stock = stock - $1 
             WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }
      } catch (err) {
        console.log("Webhook DB error:", err);
      }
    }

    res.json({ received: true });
  }
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  })
);


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1", contactRouter);


createTables();

app.use(errorMiddleware);

export default app;