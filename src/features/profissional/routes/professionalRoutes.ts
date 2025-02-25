import { Router } from 'express';
import * as professionalController from '../controllers/professionalController';

const router = Router();
router.post('/allocate', professionalController.allocateProfessional);
export default router;