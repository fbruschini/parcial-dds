import apiClient from "./client";

export async function fetchTasks(params) {
  const { data } = await apiClient.get("/tareas", { params });
  return data;
}

export async function fetchTask(id) {
  const { data } = await apiClient.get(`/tareas/${id}`);
  return data;
}

export async function fetchTaskHistory(id) {
  const { data } = await apiClient.get(`/tareas/${id}/historial`);
  return data;
}

export async function createTask(payload) {
  const { data } = await apiClient.post("/tareas", payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await apiClient.put(`/tareas/${id}`, payload);
  return data;
}

export async function changeTaskState(id, action) {
  const { data } = await apiClient.patch(`/tareas/${id}/${action}`);
  return data;
}

export async function fetchSummary() {
  const { data } = await apiClient.get("/tareas/resumen");
  return data;
}
