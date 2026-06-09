import apiClient from "./client";

export async function fetchProjects() {
  const { data } = await apiClient.get("/proyectos");
  return data;
}
