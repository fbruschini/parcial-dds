const ROLES = {
  COLABORADOR: "colaborador",
  LIDER: "lider",
  ADMIN: "admin",
};

const PRIORIDADES = ["baja", "media", "alta", "critica"];

const ESTADOS_TAREA = [
  "pendiente",
  "en_progreso",
  "bloqueada",
  "finalizada",
  "cancelada",
];

const ESTADOS_PROYECTO = ["activo", "pausado", "finalizado"];

const TRANSICIONES_ESTADO = {
  pendiente: ["en_progreso", "cancelada"],
  en_progreso: ["bloqueada", "finalizada", "cancelada"],
  bloqueada: ["en_progreso", "cancelada"],
  finalizada: [],
  cancelada: [],
};

const ADMIN_ROLES = [ROLES.ADMIN, ROLES.LIDER];

module.exports = {
  ROLES,
  PRIORIDADES,
  ESTADOS_TAREA,
  ESTADOS_PROYECTO,
  TRANSICIONES_ESTADO,
  ADMIN_ROLES,
};
