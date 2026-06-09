const express = require("express");
const tareasController = require("../controllers/tareas.controller");
const { authenticate, requireRoles } = require("../middleware/auth.middleware");
const { requireBodyFields } = require("../middleware/validation.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/", tareasController.listTasks);
router.get("/resumen", requireRoles("admin", "lider"), tareasController.getSummary);
router.get("/:id", tareasController.getTaskById);
router.get("/:id/historial", tareasController.getHistory);
router.post(
  "/",
  requireBodyFields(["proyectoId", "titulo", "descripcion", "responsableId", "prioridad", "fechaLimite"]),
  tareasController.createTask
);
router.put("/:id", tareasController.updateTask);
router.patch("/:id/iniciar", tareasController.iniciar);
router.patch("/:id/bloquear", tareasController.bloquear);
router.patch("/:id/cancelar", requireRoles("admin", "lider"), tareasController.cancelar);
router.patch("/:id/finalizar", requireRoles("admin", "lider"), tareasController.finalizar);

module.exports = router;
