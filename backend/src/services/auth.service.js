const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const { readData, writeData } = require("../data/database");
const { ROLES } = require("../config/constants");
const { getJwtSecret, getJwtExpiresIn } = require("../config/auth");
const AppError = require("../utils/AppError");

function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
    getJwtSecret(),
    { expiresIn: getJwtExpiresIn() }
  );
}

function register(payload) {
  const { nombre, email, password, rol = ROLES.COLABORADOR } = payload;

  if (!nombre || !email || !password) {
    throw new AppError("Nombre, email y password son obligatorios", 400);
  }

  if (!Object.values(ROLES).includes(rol)) {
    throw new AppError("El rol indicado no es valido", 400);
  }

  const data = readData();
  const normalizedEmail = email.trim().toLowerCase();
  const exists = data.usuarios.some((user) => user.email === normalizedEmail);

  if (exists) {
    throw new AppError("Ya existe un usuario con ese email", 400);
  }

  const user = {
    id: `usr-${randomUUID()}`,
    nombre: nombre.trim(),
    email: normalizedEmail,
    passwordHash: bcrypt.hashSync(password, 10),
    rol,
    activo: true,
  };

  data.usuarios.push(user);
  writeData(data);

  return {
    user: publicUser(user),
    token: signToken(user),
  };
}

function login(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError("Email y password son obligatorios", 400);
  }

  const data = readData();
  const normalizedEmail = email.trim().toLowerCase();
  const user = data.usuarios.find((candidate) => candidate.email === normalizedEmail);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw new AppError("Credenciales invalidas", 401);
  }

  if (!user.activo) {
    throw new AppError("El usuario esta inactivo", 403);
  }

  return {
    user: publicUser(user),
    token: signToken(user),
  };
}

module.exports = {
  publicUser,
  register,
  login,
};
