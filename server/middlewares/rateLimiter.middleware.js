import rateLimit from "express-rate-limit";

const inTests = () => process.env.NODE_ENV === "test";
const limiter = (windowMs, max, code, message) =>
  rateLimit({ windowMs, max, skip: inTests, standardHeaders: true, legacyHeaders: false, message: { success: false, error: { code, message } } });

export const generalLimiter = limiter(15 * 60 * 1000, 300, "TOO_MANY_REQUESTS", "Too many requests from this IP, please try again later.");
export const loginLimiter = limiter(15 * 60 * 1000, 30, "TOO_MANY_LOGINS", "Too many sign-in attempts. Try again in a few minutes.");
export const uploadLimiter = limiter(60 * 60 * 1000, 120, "TOO_MANY_UPLOADS", "Too many uploads. Try again later.");
