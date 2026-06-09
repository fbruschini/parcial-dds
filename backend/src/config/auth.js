function getJwtSecret() {
  return process.env.JWT_SECRET || "dds-secret-desarrollo";
}

function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || "8h";
}

module.exports = {
  getJwtSecret,
  getJwtExpiresIn,
};
