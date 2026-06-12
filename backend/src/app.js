require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const proyectosRoutes = require("./routes/proyectos.routes");
const tareasRoutes = require("./routes/tareas.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const { ensureDatabase } = require("./data/database");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

ensureDatabase();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api/usuarios", usuariosRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
