const bcrypt = require("bcryptjs");

const PASSWORD = "Password123!";

function createUsers() {
  const passwordHash = bcrypt.hashSync(PASSWORD, 10);

  return [
    {
      id: "usr-admin",
      nombre: "Ana Admin",
      email: "admin@dds.com",
      passwordHash,
      rol: "admin",
      activo: true,
    },
    {
      id: "usr-lider",
      nombre: "Leo Lider",
      email: "lider@dds.com",
      passwordHash,
      rol: "lider",
      activo: true,
    },
    {
      id: "usr-mica",
      nombre: "Mica Torres",
      email: "mica@dds.com",
      passwordHash,
      rol: "colaborador",
      activo: true,
    },
    {
      id: "usr-juan",
      nombre: "Juan Perez",
      email: "juan@dds.com",
      passwordHash,
      rol: "colaborador",
      activo: true,
    },
    {
      id: "usr-sofia",
      nombre: "Sofia Ruiz",
      email: "sofia@dds.com",
      passwordHash,
      rol: "colaborador",
      activo: true,
    },
  ];
}

function addDays(baseDate, offset) {
  const date = new Date(baseDate);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

function formatDateOnly(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateOnlyFromToday(offset, today) {
  return formatDateOnly(addDays(today, offset));
}

function dateTimeFromToday(offset, today, hour = 9) {
  const date = addDays(today, offset);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function createSeedData() {
  const today = new Date();

  return {
    usuarios: createUsers(),
    proyectos: [
      {
        id: "proy-portal",
        codigo: "DDS-PORTAL",
        nombre: "Portal de alumnos",
        descripcion: "Sistema interno de seguimiento academico",
        estado: "activo",
        integrantes: ["usr-admin", "usr-lider", "usr-mica", "usr-juan"],
      },
      {
        id: "proy-api",
        codigo: "DDS-API",
        nombre: "API de cursadas",
        descripcion: "Servicios para gestionar cursadas y evaluaciones",
        estado: "activo",
        integrantes: ["usr-lider", "usr-mica", "usr-sofia"],
      },
      {
        id: "proy-mobile",
        codigo: "DDS-MOB",
        nombre: "App mobile",
        descripcion: "Aplicacion movil de avisos y tareas",
        estado: "pausado",
        integrantes: ["usr-admin", "usr-juan", "usr-sofia"],
      },
      {
        id: "proy-legacy",
        codigo: "DDS-LEG",
        nombre: "Migracion legacy",
        descripcion: "Migracion de tablero historico",
        estado: "finalizado",
        integrantes: ["usr-admin", "usr-lider"],
      },
    ],
    tareas: [
      {
        id: "tar-1001",
        proyectoId: "proy-portal",
        titulo: "Implementar login",
        descripcion: "Crear endpoint y pantalla de login",
        responsableId: "usr-mica",
        prioridad: "alta",
        estado: "pendiente",
        fechaLimite: dateOnlyFromToday(9, today),
        createdAt: dateTimeFromToday(-4, today),
      },
      {
        id: "tar-1002",
        proyectoId: "proy-portal",
        titulo: "Validar permisos",
        descripcion: "Agregar middleware de roles para acciones protegidas",
        responsableId: "usr-lider",
        prioridad: "critica",
        estado: "en_progreso",
        fechaLimite: dateOnlyFromToday(6, today),
        createdAt: dateTimeFromToday(-5, today),
      },
      {
        id: "tar-1003",
        proyectoId: "proy-portal",
        titulo: "Disenar dashboard",
        descripcion: "Vista resumen de estados y vencimientos",
        responsableId: "usr-juan",
        prioridad: "media",
        estado: "bloqueada",
        fechaLimite: dateOnlyFromToday(13, today),
        createdAt: dateTimeFromToday(-3, today),
      },
      {
        id: "tar-1004",
        proyectoId: "proy-portal",
        titulo: "Documentar rutas",
        descripcion: "Completar README con endpoints principales",
        responsableId: "usr-admin",
        prioridad: "baja",
        estado: "finalizada",
        fechaLimite: dateOnlyFromToday(-2, today),
        createdAt: dateTimeFromToday(-10, today),
      },
      {
        id: "tar-1005",
        proyectoId: "proy-api",
        titulo: "Filtros combinables",
        descripcion: "Permitir filtrar tareas por proyecto, responsable, estado y prioridad",
        responsableId: "usr-mica",
        prioridad: "alta",
        estado: "en_progreso",
        fechaLimite: dateOnlyFromToday(5, today),
        createdAt: dateTimeFromToday(-6, today),
      },
      {
        id: "tar-1006",
        proyectoId: "proy-api",
        titulo: "Ordenamiento paginado",
        descripcion: "Resolver page, limit, sortBy y order desde el backend",
        responsableId: "usr-sofia",
        prioridad: "media",
        estado: "pendiente",
        fechaLimite: dateOnlyFromToday(18, today),
        createdAt: dateTimeFromToday(-1, today),
      },
      {
        id: "tar-1007",
        proyectoId: "proy-api",
        titulo: "Pruebas de login",
        descripcion: "Cubrir login correcto e invalido con Supertest",
        responsableId: "usr-lider",
        prioridad: "critica",
        estado: "finalizada",
        fechaLimite: dateOnlyFromToday(0, today),
        createdAt: dateTimeFromToday(-8, today),
      },
      {
        id: "tar-1008",
        proyectoId: "proy-api",
        titulo: "Manejo centralizado de errores",
        descripcion: "Responder JSON uniforme desde middleware de error",
        responsableId: "usr-mica",
        prioridad: "alta",
        estado: "cancelada",
        fechaLimite: dateOnlyFromToday(3, today),
        createdAt: dateTimeFromToday(-7, today),
      },
      {
        id: "tar-1009",
        proyectoId: "proy-mobile",
        titulo: "Prototipo navegacion",
        descripcion: "Definir rutas principales del frontend mobile",
        responsableId: "usr-juan",
        prioridad: "media",
        estado: "pendiente",
        fechaLimite: dateOnlyFromToday(7, today),
        createdAt: dateTimeFromToday(-4, today),
      },
      {
        id: "tar-1010",
        proyectoId: "proy-mobile",
        titulo: "Revisar accesibilidad",
        descripcion: "Validar contrastes y etiquetas en formularios",
        responsableId: "usr-sofia",
        prioridad: "baja",
        estado: "bloqueada",
        fechaLimite: dateOnlyFromToday(-1, today),
        createdAt: dateTimeFromToday(-9, today),
      },
      {
        id: "tar-1011",
        proyectoId: "proy-mobile",
        titulo: "Configurar Axios",
        descripcion: "Crear instancia con baseURL y Authorization",
        responsableId: "usr-admin",
        prioridad: "alta",
        estado: "en_progreso",
        fechaLimite: dateOnlyFromToday(2, today),
        createdAt: dateTimeFromToday(-5, today),
      },
      {
        id: "tar-1012",
        proyectoId: "proy-legacy",
        titulo: "Cerrar tablero anterior",
        descripcion: "Marcar el flujo legacy como finalizado",
        responsableId: "usr-lider",
        prioridad: "media",
        estado: "finalizada",
        fechaLimite: dateOnlyFromToday(-11, today),
        createdAt: dateTimeFromToday(-20, today),
      },
      {
        id: "tar-1013",
        proyectoId: "proy-portal",
        titulo: "Pantalla de detalle",
        descripcion: "Mostrar informacion de tarea e historial",
        responsableId: "usr-mica",
        prioridad: "critica",
        estado: "pendiente",
        fechaLimite: dateOnlyFromToday(-4, today),
        createdAt: dateTimeFromToday(-12, today),
      },
      {
        id: "tar-1014",
        proyectoId: "proy-api",
        titulo: "Semilla inicial",
        descripcion: "Preparar usuarios, proyectos y tareas previsibles",
        responsableId: "usr-sofia",
        prioridad: "baja",
        estado: "finalizada",
        fechaLimite: dateOnlyFromToday(-3, today),
        createdAt: dateTimeFromToday(-9, today),
      },
      {
        id: "tar-1015",
        proyectoId: "proy-portal",
        titulo: "Validar responsables",
        descripcion: "Rechazar responsable que no integra el proyecto",
        responsableId: "usr-juan",
        prioridad: "critica",
        estado: "en_progreso",
        fechaLimite: dateOnlyFromToday(-5, today),
        createdAt: dateTimeFromToday(-13, today),
      },
    ],
    historial_tareas: [
      {
        id: "hist-1001",
        tareaId: "tar-1001",
        usuarioId: "usr-admin",
        accion: "creacion",
        fechaHora: dateTimeFromToday(-4, today, 10),
        valorAnterior: null,
        valorNuevo: { estado: "pendiente", responsableId: "usr-mica" },
      },
      {
        id: "hist-1002",
        tareaId: "tar-1002",
        usuarioId: "usr-lider",
        accion: "cambio_estado",
        fechaHora: dateTimeFromToday(-4, today, 14),
        valorAnterior: { estado: "pendiente" },
        valorNuevo: { estado: "en_progreso" },
      },
      {
        id: "hist-1003",
        tareaId: "tar-1003",
        usuarioId: "usr-admin",
        accion: "cambio_estado",
        fechaHora: dateTimeFromToday(-2, today, 11),
        valorAnterior: { estado: "en_progreso" },
        valorNuevo: { estado: "bloqueada" },
      },
    ],
  };
}

module.exports = {
  PASSWORD,
  createSeedData,
};
