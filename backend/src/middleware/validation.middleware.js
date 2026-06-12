const AppError = require("../utils/AppError");

function requireBodyFields(fields) {
  return (req, _res, next) => {
    const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === "");

    if (missing.length > 0) {
      return next(new AppError(`Faltan campos obligatorios: ${missing.join(", ")}`, 400));
    }

    return next();
  };
}

module.exports = {
  requireBodyFields,
};
