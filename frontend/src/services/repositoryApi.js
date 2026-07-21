import { apiFetch } from './apiClient';

export function analyzeRepository(repoUrl) {
  return apiFetch('/repository/analyze', {
    method: 'POST',
    body: JSON.stringify({ repoUrl }),
  });
}

export function getProjectMemory(projectId) {
  return apiFetch(`/projects/${projectId}/memory`);
}
