const express = require("express");
const proyectosController = require("../controllers/proyectos.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticate, proyectosController.listProjects);

module.exports = router;
