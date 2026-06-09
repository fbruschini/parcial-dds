const { readData } = require("../data/database");
const { ADMIN_ROLES } = require("../config/constants");

function listProjects(user) {
  const data = readData();

  if (ADMIN_ROLES.includes(user.rol)) {
    return data.proyectos;
  }

  return data.proyectos.filter((project) => project.integrantes.includes(user.id));
}

module.exports = {
  listProjects,
};
