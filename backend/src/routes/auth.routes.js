const express = require("express");
const authController = require("../controllers/auth.controller");
const { requireBodyFields } = require("../middleware/validation.middleware");

const router = express.Router();

router.post("/register", requireBodyFields(["nombre", "email", "password"]), authController.register);
router.post("/login", requireBodyFields(["email", "password"]), authController.login);

module.exports = router;
