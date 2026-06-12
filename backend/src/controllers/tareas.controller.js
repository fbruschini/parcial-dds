const tareasService = require("../services/tareas.service");

function listTasks(req, res, next) {
  try {
    res.json(tareasService.listTasks(req.query, req.user));
  } catch (error) {
    next(error);
  }
}

function getSummary(req, res, next) {
  try {
    res.json(tareasService.getSummary(req.user));
  } catch (error) {
    next(error);
  }
}

function getTaskById(req, res, next) {
  try {
    res.json(tareasService.getTaskById(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

function getHistory(req, res, next) {
  try {
    res.json(tareasService.getHistory(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
}

function createTask(req, res, next) {
  try {
    res.status(201).json(tareasService.createTask(req.body, req.user));
  } catch (error) {
    next(error);
  }
}

function updateTask(req, res, next) {
  try {
    res.json(tareasService.updateTask(req.params.id, req.body, req.user));
  } catch (error) {
    next(error);
  }
}

function iniciar(req, res, next) {
  try {
    res.json(tareasService.changeTaskState(req.params.id, "en_progreso", req.user));
  } catch (error) {
    next(error);
  }
}

function bloquear(req, res, next) {
  try {
    res.json(tareasService.changeTaskState(req.params.id, "bloqueada", req.user));
  } catch (error) {
    next(error);
  }
}

function cancelar(req, res, next) {
  try {
    res.json(tareasService.changeTaskState(req.params.id, "cancelada", req.user));
  } catch (error) {
    next(error);
  }
}

function finalizar(req, res, next) {
  try {
    res.json(tareasService.changeTaskState(req.params.id, "finalizada", req.user));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTasks,
  getSummary,
  getTaskById,
  getHistory,
  createTask,
  updateTask,
  iniciar,
  bloquear,
  cancelar,
  finalizar,
};
