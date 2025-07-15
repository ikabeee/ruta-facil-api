import { Router } from 'express';
import { IncidentController } from './incidents.controller';

const router = Router();
const incidentController = new IncidentController();

// Rutas de estadísticas y filtros especiales (deben ir primero)
router.get('/stats', incidentController.getStats.bind(incidentController));
router.get('/status/:status', incidentController.getByStatus.bind(incidentController));
router.get('/priority/:priority', incidentController.getByPriority.bind(incidentController));
router.get('/route/:routeId', incidentController.getByRoute.bind(incidentController));

// Rutas principales (dinámicas van al final)
router.get('/', incidentController.getAll.bind(incidentController));
router.get('/:id', incidentController.getById.bind(incidentController));
router.post('/', incidentController.create.bind(incidentController));
router.put('/:id', incidentController.update.bind(incidentController));
router.delete('/:id', incidentController.delete.bind(incidentController));

export default router;
