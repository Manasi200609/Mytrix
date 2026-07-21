 import { rm, stat } from "node:fs/promises";
import { loadKnowledgeObject } from "./loadKnowledgeObject.js";
import { loadRepositoryGraph } from "./loadRepositoryGraph.js";
import { listRepositoryIds } from './repositoryMetadata.js';
import {
  getRepositoryDirectory,
  getRepositoryFilePath,
  loadRepositoryMetadata,
  saveRepositoryMetadata,
  readJsonFileOrNull,
  writeJsonFileSafely,
} from "./repositoryMetadata.js";

import { saveKnowledgeObject } from "./saveKnowledgeObject.js";
import { saveRepositoryGraph } from "./saveRepositoryGraph.js";

const GRAPH_VERSION = '1.0.0';

/**
 * Saves a complete repository analysis. Metadata is written last, acting as a
 * completion marker for readers that load an analysis while it is being saved.
 */
export async function saveRepositoryAnalysis({
  projectId,
  repositoryUrl,
  localPath,
  knowledgeObject,
  repositoryGraph,
}) {
  validateAnalysisInput({ repositoryUrl, localPath, knowledgeObject, repositoryGraph });

  await saveKnowledgeObject(projectId, knowledgeObject);
  await saveRepositoryGraph(projectId, repositoryGraph);

  const metadata = {
    projectId,
    repositoryUrl,
    localPath,
    projectName: knowledgeObject.project?.projectName ?? null,
    parserVersion: knowledgeObject.metadata?.parserVersion ?? null,
    analyzedAt: new Date().toISOString(),
    graphVersion: GRAPH_VERSION,
  };
  await saveRepositoryMetadata(projectId, metadata);
  return metadata;
}

/** Returns a complete persisted analysis, or null when no complete cache exists. */
export async function loadRepositoryAnalysis(projectId) {
  const metadata = await loadRepositoryMetadata(projectId);
  if (!metadata) return null;

  const [knowledgeObject, repositoryGraph] = await Promise.all([
    loadKnowledgeObject(projectId),
    loadRepositoryGraph(projectId),
  ]);

  if (!knowledgeObject || !repositoryGraph) return null;
  return { metadata, knowledgeObject, repositoryGraph };
}

/** Indicates whether a complete repository analysis has been persisted. */
export async function repositoryExists(projectId) {
  try {
    await stat(getRepositoryFilePath(projectId, 'metadata.json'));
    return (await loadRepositoryAnalysis(projectId)) !== null;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw new Error(`Unable to determine whether repository ${projectId} is stored.`, { cause: error });
  }
}

/** Removes all locally persisted data for one project ID. Returns whether it existed. */
export async function deleteRepository(projectId) {
  const directory = getRepositoryDirectory(projectId);
  try {
    await stat(directory);
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw new Error(`Unable to access stored repository ${projectId}.`, { cause: error });
  }

  try {
    await rm(directory, { recursive: true, force: true });
    return true;
  } catch (error) {
    throw new Error(`Unable to delete stored repository ${projectId}.`, { cause: error });
  }
}

export async function saveAnalysis(projectId, analysis) {

  if (!analysis || typeof analysis !== "object") {
    throw new TypeError("analysis must be an object.");
  }

  console.log("\n===== WRITING ANALYSIS =====");
  console.log(JSON.stringify(analysis, null, 2));

  await writeJsonFileSafely(
    getRepositoryFilePath(projectId, "analysis.json"),
    analysis
  );

  const saved = await readJsonFileOrNull(
    getRepositoryFilePath(projectId, "analysis.json")
  );

  console.log("\n===== READ BACK FROM FILE =====");
  console.log(JSON.stringify(saved, null, 2));
}

export async function loadAnalysis(projectId) {

  return readJsonFileOrNull(
    getRepositoryFilePath(projectId, "analysis.json")
  );

}

export async function listRepositoryAnalyses() {
  const ids = await listRepositoryIds();
  const results = await Promise.all(
    ids.map(async (projectId) => {
      const metadata = await loadRepositoryMetadata(projectId);
      if (!metadata) return null;
      const analysis = await loadAnalysis(projectId);
      return {
        projectId,
        repository: metadata.repositoryUrl,
        projectName: metadata.projectName,
        analyzedAt: metadata.analyzedAt,
        analysis: analysis ?? null,
      };
    })
  );
  return results.filter(Boolean);
}

function validateAnalysisInput({ repositoryUrl, localPath, knowledgeObject, repositoryGraph }) {
  if (typeof repositoryUrl !== 'string' || repositoryUrl.trim() === '') {
    throw new TypeError('repositoryUrl must be a non-empty string.');
  }
  if (typeof localPath !== 'string' || localPath.trim() === '') {
    throw new TypeError('localPath must be a non-empty string.');
  }
  if (!knowledgeObject || typeof knowledgeObject !== 'object') {
    throw new TypeError('knowledgeObject must be an object.');
  }
  if (!repositoryGraph || !Array.isArray(repositoryGraph.nodes) || !Array.isArray(repositoryGraph.edges)) {
    throw new TypeError('repositoryGraph must contain nodes and edges arrays.');
  }
}

