const { randomUUID } = require("crypto");
const { readData, writeData } = require("../data/database");
const {
  ADMIN_ROLES,
  ESTADOS_TAREA,
  PRIORIDADES,
  TRANSICIONES_ESTADO,
} = require("../config/constants");
const AppError = require("../utils/AppError");

const EDITABLE_FIELDS = [
  "titulo",
  "descripcion",
  "prioridad",
  "responsableId",
  "fechaLimite",
  "estado",
];

function isAdminLike(user) {
  return ADMIN_ROLES.includes(user.rol);
}

function requireAdminLike(user) {
  if (!isAdminLike(user)) {
    throw new AppError("No tenes permisos para realizar esta accion", 403);
  }
}

function enrichTask(task, data) {
  const proyecto = data.proyectos.find((candidate) => candidate.id === task.proyectoId);
  const responsable = data.usuarios.find((candidate) => candidate.id === task.responsableId);

  return {
    ...task,
    proyecto: proyecto
      ? { id: proyecto.id, codigo: proyecto.codigo, nombre: proyecto.nombre, estado: proyecto.estado }
      : null,
    responsable: responsable
      ? { id: responsable.id, nombre: responsable.nombre, email: responsable.email, rol: responsable.rol }
      : null,
    vencida: isOverdue(task),
  };
}

function isOverdue(task, now = new Date()) {
  const dueDate = new Date(`${task.fechaLimite}T23:59:59`);
  return dueDate < now && !["finalizada", "cancelada"].includes(task.estado);
}

function findTask(data, id) {
  const task = data.tareas.find((candidate) => candidate.id === id);

  if (!task) {
    throw new AppError("La tarea no existe", 404);
  }

  return task;
}

function findProject(data, proyectoId) {
  const project = data.proyectos.find((candidate) => candidate.id === proyectoId);

  if (!project) {
    throw new AppError("El proyecto no existe", 404);
  }

  return project;
}

function validatePriority(prioridad) {
  if (!PRIORIDADES.includes(prioridad)) {
    throw new AppError("La prioridad indicada no es valida", 400);
  }
}

function validateState(estado) {
  if (!ESTADOS_TAREA.includes(estado)) {
    throw new AppError("El estado indicado no es valido", 400);
  }
}

function validateResponsible(project, responsableId) {
  if (!project.integrantes.includes(responsableId)) {
    throw new AppError("El responsable no pertenece al proyecto", 400);
  }
}

function validateProjectAllowsNewTasks(project) {
  if (project.estado === "finalizado") {
    throw new AppError("No se pueden crear tareas en un proyecto finalizado", 400);
  }

  if (project.estado === "pausado") {
    throw new AppError("No se pueden crear tareas en un proyecto pausado", 400);
  }
}

function validateProjectAllowsChanges(project) {
  if (project.estado === "finalizado") {
    throw new AppError("No se pueden modificar tareas de un proyecto finalizado", 400);
  }
}

function validateStateTransition(currentState, nextState) {
  if (currentState === nextState) {
    return;
  }

  const allowed = TRANSICIONES_ESTADO[currentState] || [];

  if (!allowed.includes(nextState)) {
    throw new AppError(`Transicion de estado no permitida: ${currentState} -> ${nextState}`, 400);
  }
}

function ensureTaskIsEditable(task) {
  if (["finalizada", "cancelada"].includes(task.estado)) {
    throw new AppError("No se pueden editar tareas finalizadas o canceladas", 400);
  }
}

function appendHistory(data, tareaId, usuarioId, accion, valorAnterior, valorNuevo) {
  data.historial_tareas.push({
    id: `hist-${randomUUID()}`,
    tareaId,
    usuarioId,
    accion,
    fechaHora: new Date().toISOString(),
    valorAnterior,
    valorNuevo,
  });
}

function listTasks(query, user) {
  const data = readData();
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const sortBy = ["createdAt", "fechaLimite", "prioridad", "estado", "titulo"].includes(query.sortBy)
    ? query.sortBy
    : "createdAt";
  const order = query.order === "asc" ? "asc" : "desc";

  let tasks = [...data.tareas];

  if (!isAdminLike(user)) {
    tasks = tasks.filter((task) => task.responsableId === user.id);
  }

  ["proyectoId", "responsableId", "estado", "prioridad"].forEach((field) => {
    if (query[field]) {
      tasks = tasks.filter((task) => task[field] === query[field]);
    }
  });

  tasks.sort((a, b) => {
    const left = a[sortBy] || "";
    const right = b[sortBy] || "";
    const compare = String(left).localeCompare(String(right));
    return order === "asc" ? compare : -compare;
  });

  const total = tasks.length;
  const start = (page - 1) * limit;
  const paginated = tasks.slice(start, start + limit).map((task) => enrichTask(task, data));

  return {
    data: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

function getTaskById(id, user) {
  const data = readData();
  const task = findTask(data, id);

  if (!isAdminLike(user) && task.responsableId !== user.id) {
    throw new AppError("No tenes permisos para ver esta tarea", 403);
  }

  return enrichTask(task, data);
}

function getHistory(id, user) {
  const data = readData();
  const task = findTask(data, id);

  if (!isAdminLike(user) && task.responsableId !== user.id) {
    throw new AppError("No tenes permisos para ver el historial de esta tarea", 403);
  }

  return data.historial_tareas
    .filter((entry) => entry.tareaId === id)
    .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
}

function createTask(payload, user) {
  requireAdminLike(user);

  const { proyectoId, titulo, descripcion, responsableId, fechaLimite } = payload;
  const prioridad = payload.prioridad || "media";
  const estado = payload.estado || "pendiente";

  if (!proyectoId || !titulo || !descripcion || !responsableId || !fechaLimite) {
    throw new AppError("Proyecto, titulo, descripcion, responsable y fecha limite son obligatorios", 400);
  }

  validatePriority(prioridad);
  validateState(estado);

  const data = readData();
  const project = findProject(data, proyectoId);
  validateProjectAllowsNewTasks(project);
  validateResponsible(project, responsableId);

  const task = {
    id: `tar-${randomUUID()}`,
    proyectoId,
    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
    responsableId,
    prioridad,
    estado,
    fechaLimite,
    createdAt: new Date().toISOString(),
  };

  data.tareas.push(task);
  appendHistory(data, task.id, user.id, "creacion", null, task);
  writeData(data);

  return enrichTask(task, data);
}

function assertCollaboratorEditAllowed(task, payload, user) {
  if (task.responsableId !== user.id) {
    throw new AppError("No tenes permisos para editar esta tarea", 403);
  }

  const attemptedFields = Object.keys(payload).filter((field) => EDITABLE_FIELDS.includes(field));
  const forbidden = attemptedFields.filter((field) => !["descripcion", "estado"].includes(field));

  if (forbidden.length > 0) {
    throw new AppError("No tenes permisos para modificar esos campos", 403);
  }

  if (payload.estado && !["en_progreso", "bloqueada"].includes(payload.estado)) {
    throw new AppError("No tenes permisos para aplicar ese cambio de estado", 403);
  }
}

function updateTask(id, payload, user) {
  const data = readData();
  const task = findTask(data, id);
  const project = findProject(data, task.proyectoId);

  validateProjectAllowsChanges(project);
  ensureTaskIsEditable(task);

  if (!isAdminLike(user)) {
    assertCollaboratorEditAllowed(task, payload, user);
  }

  const previous = { ...task };
  const allowedPayload = {};

  EDITABLE_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      allowedPayload[field] = payload[field];
    }
  });

  if (allowedPayload.prioridad) {
    validatePriority(allowedPayload.prioridad);
  }

  if (allowedPayload.estado) {
    validateState(allowedPayload.estado);
    validateStateTransition(task.estado, allowedPayload.estado);
  }

  if (allowedPayload.responsableId) {
    validateResponsible(project, allowedPayload.responsableId);
  }

  Object.assign(task, allowedPayload);

  const changed = Object.keys(allowedPayload).reduce((acc, field) => {
    if (previous[field] !== task[field]) {
      acc[field] = { anterior: previous[field], nuevo: task[field] };
    }
    return acc;
  }, {});

  if (Object.keys(changed).length > 0) {
    appendHistory(data, task.id, user.id, "edicion", previous, { ...task });

    if (changed.responsableId) {
      appendHistory(
        data,
        task.id,
        user.id,
        "reasignacion",
        { responsableId: previous.responsableId },
        { responsableId: task.responsableId }
      );
    }

    if (changed.prioridad) {
      appendHistory(
        data,
        task.id,
        user.id,
        "cambio_prioridad",
        { prioridad: previous.prioridad },
        { prioridad: task.prioridad }
      );
    }

    if (changed.estado) {
      appendHistory(
        data,
        task.id,
        user.id,
        "cambio_estado",
        { estado: previous.estado },
        { estado: task.estado }
      );
    }
  }

  writeData(data);
  return enrichTask(task, data);
}

function changeTaskState(id, targetState, user) {
  validateState(targetState);

  const data = readData();
  const task = findTask(data, id);
  const project = findProject(data, task.proyectoId);

  validateProjectAllowsChanges(project);
  ensureTaskIsEditable(task);

  if (!isAdminLike(user)) {
    if (task.responsableId !== user.id) {
      throw new AppError("No tenes permisos para cambiar esta tarea", 403);
    }

    if (!["en_progreso", "bloqueada"].includes(targetState)) {
      throw new AppError("No tenes permisos para aplicar ese cambio de estado", 403);
    }
  }

  validateStateTransition(task.estado, targetState);

  const previousState = task.estado;
  task.estado = targetState;

  appendHistory(
    data,
    task.id,
    user.id,
    targetState === "cancelada" ? "cancelacion" : "cambio_estado",
    { estado: previousState },
    { estado: targetState }
  );
  writeData(data);

  return enrichTask(task, data);
}

function getSummary(user) {
  requireAdminLike(user);

  const data = readData();
  const tareasPorEstado = ESTADOS_TAREA.reduce((acc, estado) => {
    acc[estado] = data.tareas.filter((task) => task.estado === estado).length;
    return acc;
  }, {});
  const tareasVencidas = data.tareas.filter((task) => isOverdue(task)).map((task) => enrichTask(task, data));
  const cargaPorResponsable = data.usuarios.map((userRecord) => ({
    responsableId: userRecord.id,
    nombre: userRecord.nombre,
    cantidad: data.tareas.filter((task) => task.responsableId === userRecord.id).length,
  }));

  return {
    tareasPorEstado,
    tareasVencidas,
    cargaPorResponsable,
    tareasCriticas: data.tareas.filter((task) => task.prioridad === "critica").length,
  };
}

module.exports = {
  listTasks,
  getTaskById,
  getHistory,
  createTask,
  updateTask,
  changeTaskState,
  getSummary,
};
