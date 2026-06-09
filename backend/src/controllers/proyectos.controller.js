const proyectosService = require("../services/proyectos.service");

function listProjects(req, res, next) {
  try {
    res.json(proyectosService.listProjects(req.user));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProjects,
};
