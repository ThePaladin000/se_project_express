const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "An error has occurred on the server",
  });
};

module.exports = errorHandler;
