const fs = require("fs");
const path = require("path");
const { createSeedData } = require("./seedData");

function getDatabaseFile() {
  return process.env.DB_FILE || path.join(__dirname, "database.json");
}

function ensureDatabase() {
  const filePath = getDatabaseFile();
  const directory = path.dirname(filePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(createSeedData(), null, 2));
  }
}

function readData() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(getDatabaseFile(), "utf-8"));
}

function writeData(data) {
  ensureDatabase();
  fs.writeFileSync(getDatabaseFile(), JSON.stringify(data, null, 2));
}

function resetData() {
  const data = createSeedData();
  writeData(data);
  return data;
}

module.exports = {
  ensureDatabase,
  readData,
  writeData,
  resetData,
};
