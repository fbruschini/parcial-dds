function notFoundHandler(req, _res, next) {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: statusCode === 500 ? "Error interno del servidor" : err.message,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
