import { loadKnowledgeObject } from "../storage/loadKnowledgeObject.js";
import { loadRepositoryGraph } from "../storage/loadRepositoryGraph.js";
import { loadRepositoryMetadata } from "../storage/repositoryMetadata.js";
import { loadAnalysis } from "../storage/repositoryStore.js";
import { listRepositoryAnalyses } from "../storage/repositoryStore.js";

/**
 * GET /api/projects/:projectId/memory
 *
 * Returns the complete stored Project Memory.
 */
export async function getProjectMemory(req, res) {
  const { projectId } = req.params;

  try {
    const [metadata, knowledgeObject, repositoryGraph, analysis] = await Promise.all([
      loadRepositoryMetadata(projectId),
      loadKnowledgeObject(projectId),
      loadRepositoryGraph(projectId),
      loadAnalysis(projectId),
    ]);

    if (!metadata || !knowledgeObject || !repositoryGraph || !analysis) {
      return res.status(404).json({
        success: false,
        message: "Mytrix not found.",
      });
    }

    return res.status(200).json({
      success: true,
      metadata,
      knowledgeObject,
      repositoryGraph,
      analysis,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to load Project Memory.",
    });
  }
}

/**
 * GET /api/projects
 *
 * Returns a summary list of every saved project.
 */
export async function listProjects(req, res) {
  try {
    const projects = await listRepositoryAnalyses();
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to list saved projects.",
    });
  }
}