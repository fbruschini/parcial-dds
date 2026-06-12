const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/auth");
const AppError = require("../utils/AppError");

function authenticate(req, _res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("No se envio JWT", 401));
  }

  try {
    req.user = jwt.verify(header.replace("Bearer ", ""), getJwtSecret());
    return next();
  } catch (_error) {
    return next(new AppError("JWT invalido o vencido", 401));
  }
}

function requireRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError("No se envio JWT", 401));
    }

    if (!roles.includes(req.user.rol)) {
      return next(new AppError("No tenes permisos para realizar esta accion", 403));
    }

    return next();
  };
}

module.exports = {
  authenticate,
  requireRoles,
};
