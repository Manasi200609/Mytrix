import { Router } from "express";
import { getProjectMemory, listProjects } from "../controllers/projectController.js";

const router = Router();

/*
 * GET /api/projects/:projectId/memory
 */
router.get("/", listProjects);
router.get("/:projectId/memory", getProjectMemory);

export default router;