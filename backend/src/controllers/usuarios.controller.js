const usuariosService = require("../services/usuarios.service");

function listUsers(req, res, next) {
  try {
    res.json(usuariosService.listUsers(req.user));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
};
