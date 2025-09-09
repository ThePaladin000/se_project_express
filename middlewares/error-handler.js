const errorHandler = (err, req, res, next) => {
  // Log the error to console
  console.error(err);

  // If the error has a statusCode property, use it; otherwise default to 500
  const statusCode = err.statusCode || 500;

  // Send response with appropriate status code and message
  res.status(statusCode).json({
    message: err.message || "An error has occurred on the server",
  });
};

module.exports = errorHandler;
