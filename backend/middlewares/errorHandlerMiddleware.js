const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Development mode
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // Production mode
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
