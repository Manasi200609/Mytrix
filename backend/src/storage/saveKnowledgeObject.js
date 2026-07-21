import { getRepositoryFilePath, writeJsonFileSafely } from './repositoryMetadata.js';

/** Persists the parser output as data/repositories/<projectId>/knowledge.json. */
export async function saveKnowledgeObject(projectId, knowledgeObject) {
  if (!knowledgeObject || typeof knowledgeObject !== 'object') {
    throw new TypeError('knowledgeObject must be an object.');
  }
  await writeJsonFileSafely(getRepositoryFilePath(projectId, 'knowledge.json'), knowledgeObject);
}
