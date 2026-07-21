import { apiFetch } from "./apiClient";

export async function getSavedProjects() {
  return apiFetch("/projects");
}

export async function getProjectById(projectId) {
  return apiFetch(`/projects/${projectId}`);
}

export async function deleteProject(projectId) {
  return apiFetch(`/projects/${projectId}`, {
    method: "DELETE",
  });
}

export async function renameProject(projectId, name) {
  return apiFetch(`/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function saveProject(projectData) {
  return apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}