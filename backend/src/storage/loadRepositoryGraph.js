import { getRepositoryFilePath, readJsonFileOrNull } from './repositoryMetadata.js';

/** Loads a saved Repository Knowledge Graph, or null when it has not been saved. */
export async function loadRepositoryGraph(projectId) {
  return readJsonFileOrNull(getRepositoryFilePath(projectId, 'graph.json'));
}
