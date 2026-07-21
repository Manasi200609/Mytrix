import { getRepositoryFilePath, readJsonFileOrNull } from './repositoryMetadata.js';

/** Loads a saved Project Knowledge Object, or null when it has not been saved. */
export async function loadKnowledgeObject(projectId) {
  return readJsonFileOrNull(getRepositoryFilePath(projectId, 'knowledge.json'));
}
