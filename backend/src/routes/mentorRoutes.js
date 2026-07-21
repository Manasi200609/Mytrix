import { Router } from 'express';
import { mentorRepository } from '../controllers/mentorController.js';

const mentorRoutes = Router();

mentorRoutes.post('/', mentorRepository);

export default mentorRoutes;