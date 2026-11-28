export class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "An unexpected error occurred.";

  // Log error safely (never log sensitive payment secrets or passwords)
  if (statusCode >= 500) {
    console.error(`[ERROR ${new Date().toISOString()}] ${req.method} ${req.originalUrl}:`, {
      code,
      message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      // Unexpected failures (500) stay generic in production; deliberate 502/503 errors (GitHub
      // unreachable, saves or admins not configured) carry a safe message the admin can act on.
      message: statusCode === 500 && process.env.NODE_ENV === "production" ? "Internal server error" : message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
};
