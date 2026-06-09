const express = require("express");
const usuariosController = require("../controllers/usuarios.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticate, usuariosController.listUsers);

module.exports = router;
