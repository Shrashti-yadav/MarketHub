import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, message, res, cookieName = "token") => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const isProduction = process.env.NODE_ENV === "production";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: isProduction,       // ✅ true in production (HTTPS only)
      sameSite: isProduction ? "none" : "lax", // ✅ "none" required for cross-domain cookies
    })
    .json({
      success: true,
      user,
      message,
      token,
    });
};