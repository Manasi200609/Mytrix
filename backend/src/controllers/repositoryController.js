import { analyzeRepositoryAI } from "../ai/analysisEngine.js";
import { saveAnalysis } from "../storage/repositoryStore.js";
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import { cloneRepository, CloneRepositoryError } from "../services/cloneRepository.js";
import { validateGithubUrl } from "../utils/validateGithubUrl.js";

import { parseRepository } from "../parser/repositoryParser.js";
import { buildGraph } from "../graph/graphBuilder.js";

import { saveKnowledgeObject } from "../storage/saveKnowledgeObject.js";
import { saveRepositoryGraph } from "../storage/saveRepositoryGraph.js";
import { saveRepositoryMetadata } from "../storage/repositoryMetadata.js";

/**
 * POST /api/repository/analyze
 *
 * Complete Repository Analysis Pipeline
 */
export async function analyzeRepository(req, res) {

    const cloneUrl = validateGithubUrl(req.body?.repoUrl);

    if (!cloneUrl) {
        return res.status(400).json({
            success: false,
            message:
                "repoUrl must be a valid public GitHub repository URL."
        });
    }

    // Extract repository name from GitHub URL
    const repositoryName = cloneUrl
        .split("/")
        .pop()
        .replace(/\.git$/, "");

    const projectId = randomUUID();

    const uploadsDirectory = path.resolve(process.cwd(), "uploads");

    try {

        //---------------------------------------------------
        // Ensure uploads directory exists
        //---------------------------------------------------

        await mkdir(uploadsDirectory, { recursive: true });

        //---------------------------------------------------
        // Phase 1
        // Clone Repository
        //---------------------------------------------------

        const relativeRepositoryPath = await cloneRepository({
            repoUrl: cloneUrl,
            projectId,
            uploadsDirectory,
        });

        const repositoryPath = path.join(
            process.cwd(),
            relativeRepositoryPath
        );

        //---------------------------------------------------
        // Phase 2
        // Parse Repository
        //---------------------------------------------------

        const knowledgeObject = await parseRepository(
            repositoryPath,
            repositoryName
        );

        console.log("Repository from URL:", repositoryName);
console.log("Knowledge Object:", knowledgeObject.project.projectName);

        //---------------------------------------------------
        // Phase 3
        // Build Repository Graph
        //---------------------------------------------------

        const repositoryGraph = await buildGraph(
            knowledgeObject
        );

        //---------------------------------------------------
        // Phase 4
        // AI Analysis
        //---------------------------------------------------

        const analysis = await analyzeRepositoryAI(
            knowledgeObject,
            repositoryGraph
        );

        //---------------------------------------------------
        // Phase 5
        // Save Everything
        //---------------------------------------------------

        await saveKnowledgeObject(
            projectId,
            knowledgeObject
        );

        await saveRepositoryGraph(
            projectId,
            repositoryGraph
        );

        await saveAnalysis(
            projectId,
            analysis
        );

        await saveRepositoryMetadata(projectId, {
    projectId,
    repositoryName,   // <-- use the GitHub repo name directly
    repositoryRoot: knowledgeObject.metadata.repositoryRoot,
    parserVersion: knowledgeObject.metadata.parserVersion,
    scannedAt: knowledgeObject.metadata.scannedAt,
    status: "completed",
});

        //---------------------------------------------------
        // Success
        //---------------------------------------------------

        return res.status(201).json({
            success: true,
            projectId,
            repositoryName:
                knowledgeObject.project.projectName,
            status: "completed",
            analysis,
        });

    } catch (error) {

        console.error(error);

        if (error instanceof CloneRepositoryError) {
            return res.status(502).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error.message ??
                "Repository analysis failed.",
        });

    }

}