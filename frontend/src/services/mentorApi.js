import { apiFetch } from './apiClient.js';

export const askMentor = ({ knowledgeObject, repositoryGraph, question }) =>
  apiFetch('/mentor', {
    method: 'POST',
    body: JSON.stringify({ knowledgeObject, repositoryGraph, question }),
  });