const fs = require("fs");
const os = require("os");
const path = require("path");

process.env.DB_FILE = path.join(os.tmpdir(), `dds-test-${process.pid}.json`);
process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const app = require("../src/app");
const { resetData } = require("../src/data/database");
const { PASSWORD } = require("../src/data/seedData");

async function login(email = "admin@dds.com", password = PASSWORD) {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.token;
}

describe("API seguimiento de tareas", () => {
  beforeEach(() => {
    resetData();
  });

  afterAll(() => {
    if (fs.existsSync(process.env.DB_FILE)) {
      fs.unlinkSync(process.env.DB_FILE);
    }
  });

  test("login correcto devuelve usuario y JWT", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@dds.com", password: PASSWORD });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({ email: "admin@dds.com", rol: "admin" });
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  test("login invalido devuelve 401 y error JSON", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@dds.com", password: "incorrecta" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Credenciales invalidas" });
  });

  test("lista tareas con paginacion", async () => {
    const token = await login();
    const response = await request(app)
      .get("/api/tareas?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(5);
    expect(response.body.pagination.total).toBe(15);
  });

  test("lista tareas con filtros combinables", async () => {
    const token = await login();
    const response = await request(app)
      .get("/api/tareas?proyectoId=proy-api&prioridad=alta&estado=en_progreso")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      proyectoId: "proy-api",
      prioridad: "alta",
      estado: "en_progreso",
    });
  });

  test("detalle de tarea existente", async () => {
    const token = await login();
    const response = await request(app)
      .get("/api/tareas/tar-1001")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: "tar-1001", titulo: "Implementar login" });
  });

  test("detalle de tarea inexistente devuelve 404", async () => {
    const token = await login();
    const response = await request(app)
      .get("/api/tareas/tar-inexistente")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("La tarea no existe");
  });

  test("crea una tarea valida", async () => {
    const token = await login("lider@dds.com");
    const response = await request(app)
      .post("/api/tareas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        proyectoId: "proy-api",
        titulo: "Nueva integracion",
        descripcion: "Conectar vista con API",
        responsableId: "usr-sofia",
        prioridad: "media",
        estado: "pendiente",
        fechaLimite: "2026-07-01",
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      proyectoId: "proy-api",
      responsableId: "usr-sofia",
      prioridad: "media",
    });
  });

  test("rechaza crear tarea con responsable fuera del proyecto", async () => {
    const token = await login();
    const response = await request(app)
      .post("/api/tareas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        proyectoId: "proy-api",
        titulo: "Responsable incorrecto",
        descripcion: "Debe fallar",
        responsableId: "usr-juan",
        prioridad: "media",
        estado: "pendiente",
        fechaLimite: "2026-07-01",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("El responsable no pertenece al proyecto");
  });

  test("rechaza prioridad no permitida", async () => {
    const token = await login();
    const response = await request(app)
      .post("/api/tareas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        proyectoId: "proy-api",
        titulo: "Prioridad incorrecta",
        descripcion: "Debe fallar",
        responsableId: "usr-sofia",
        prioridad: "urgente",
        estado: "pendiente",
        fechaLimite: "2026-07-01",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("La prioridad indicada no es valida");
  });

  test("rechaza estado no permitido", async () => {
    const token = await login();
    const response = await request(app)
      .post("/api/tareas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        proyectoId: "proy-api",
        titulo: "Estado incorrecto",
        descripcion: "Debe fallar",
        responsableId: "usr-sofia",
        prioridad: "media",
        estado: "lista",
        fechaLimite: "2026-07-01",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("El estado indicado no es valido");
  });

  test("rechaza ruta protegida sin JWT", async () => {
    const response = await request(app).post("/api/tareas").send({});

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("No se envio JWT");
  });

  test("rechaza colaborador en accion solo admin o lider", async () => {
    const token = await login("mica@dds.com");
    const response = await request(app)
      .post("/api/tareas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        proyectoId: "proy-api",
        titulo: "No autorizado",
        descripcion: "Debe fallar",
        responsableId: "usr-mica",
        prioridad: "media",
        estado: "pendiente",
        fechaLimite: "2026-07-01",
      });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("No tenes permisos para realizar esta accion");
  });

  test("rechaza crear tarea sobre proyecto finalizado", async () => {
    const token = await login();
    const response = await request(app)
      .post("/api/tareas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        proyectoId: "proy-legacy",
        titulo: "No crear",
        descripcion: "Proyecto finalizado",
        responsableId: "usr-lider",
        prioridad: "media",
        estado: "pendiente",
        fechaLimite: "2026-07-01",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No se pueden crear tareas en un proyecto finalizado");
  });

  test("rechaza crear tarea sobre proyecto pausado", async () => {
    const token = await login();
    const response = await request(app)
      .post("/api/tareas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        proyectoId: "proy-mobile",
        titulo: "No crear",
        descripcion: "Proyecto pausado",
        responsableId: "usr-sofia",
        prioridad: "media",
        estado: "pendiente",
        fechaLimite: "2026-07-01",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No se pueden crear tareas en un proyecto pausado");
  });

  test("rechaza transicion de estado no permitida", async () => {
    const token = await login();
    const response = await request(app)
      .put("/api/tareas/tar-1001")
      .set("Authorization", `Bearer ${token}`)
      .send({ estado: "finalizada" });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Transicion de estado no permitida");
  });
});
