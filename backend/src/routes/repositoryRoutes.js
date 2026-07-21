import { Router } from 'express';
import { analyzeRepository } from '../controllers/repositoryController.js';

const repositoryRoutes = Router();

// The controller owns validation and repository-intake orchestration.
repositoryRoutes.post('/analyze', analyzeRepository);

export default repositoryRoutes;
