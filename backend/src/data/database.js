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

  normalizePersistedDates(filePath);
}

function parseDeadlineEnd(fechaLimite) {
  return new Date(`${fechaLimite}T23:59:59`);
}

function normalizePersistedDates(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let changed = false;

  data.tareas = data.tareas.map((task) => {
    if (!task.createdAt || !task.fechaLimite) {
      return task;
    }

    const createdAt = new Date(task.createdAt);
    const deadlineEnd = parseDeadlineEnd(task.fechaLimite);

    if (Number.isNaN(createdAt.getTime()) || Number.isNaN(deadlineEnd.getTime()) || createdAt <= deadlineEnd) {
      return task;
    }

    const normalizedCreatedAt = new Date(`${task.fechaLimite}T09:00:00`).toISOString();
    changed = true;
    return { ...task, createdAt: normalizedCreatedAt };
  });

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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
