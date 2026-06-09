const { readData } = require("../data/database");
const { ADMIN_ROLES } = require("../config/constants");
const { publicUser } = require("./auth.service");

function listUsers(user) {
  const data = readData();

  if (ADMIN_ROLES.includes(user.rol)) {
    return data.usuarios.map(publicUser);
  }

  return data.usuarios.filter((candidate) => candidate.id === user.id).map(publicUser);
}

module.exports = {
  listUsers,
};
