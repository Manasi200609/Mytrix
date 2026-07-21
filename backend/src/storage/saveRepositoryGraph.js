import { getRepositoryFilePath, writeJsonFileSafely } from './repositoryMetadata.js';

/** Persists a Repository Knowledge Graph as graph.json. */
export async function saveRepositoryGraph(projectId, repositoryGraph) {
  if (!repositoryGraph || !Array.isArray(repositoryGraph.nodes) || !Array.isArray(repositoryGraph.edges)) {
    throw new TypeError('repositoryGraph must contain nodes and edges arrays.');
  }
  await writeJsonFileSafely(getRepositoryFilePath(projectId, 'graph.json'), repositoryGraph);
}
