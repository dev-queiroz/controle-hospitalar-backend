import { Router } from 'express';
import * as pepController from '../controllers/pepController';
import { offlineMiddleware } from '../../offline/services/offlineService';

const router = Router();
router.post('/', offlineMiddleware('prontuarios'), pepController.createProntuario);
router.get('/:patientId', pepController.getProntuario);
router.get('/list', pepController.listProntuarios);
router.get('/realtime', pepController.startRealtime);
router.get('/call', pepController.callPatient);
router.post('/attend', offlineMiddleware('prontuarios'), pepController.attendPatient);

export default router;