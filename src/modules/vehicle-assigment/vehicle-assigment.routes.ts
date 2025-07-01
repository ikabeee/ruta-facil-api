import express, { Request, Response } from 'express';
import { VehicleAssignmentController } from './vehicle-assigment.controller';
import { VehicleAssignmentService } from './vehicle-assigment.service';
import { VehicleAssignmentRepository } from './vehicle-assigment.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const vehicleAssignmentRepository = new VehicleAssignmentRepository(prisma);
const vehicleAssignmentService = new VehicleAssignmentService(vehicleAssignmentRepository);
const vehicleAssignmentController = new VehicleAssignmentController(vehicleAssignmentService);
const router = express.Router();

// Rutas principales del CRUD
router.get('/', async (req: Request, res: Response) => { 
    await vehicleAssignmentController.findAllVehicleAssignments(req, res); 
});
router.get('/:id', async (req: Request, res: Response) => { 
    await vehicleAssignmentController.findVehicleAssignmentById(req, res); 
});
router.post('/create', async (req: Request, res: Response) => { 
    await vehicleAssignmentController.createVehicleAssignment(req, res); 
});
router.put('/update/:id', async (req: Request, res: Response) => { 
    await vehicleAssignmentController.updateVehicleAssignment(req, res); 
});
router.delete('/delete/:id', async (req: Request, res: Response) => { 
    await vehicleAssignmentController.deleteVehicleAssignment(req, res); 
});

// Rutas adicionales para consultas específicas
router.get('/vehicle/:vehicleId', async (req: Request, res: Response) => { 
    await vehicleAssignmentController.findVehicleAssignmentsByVehicleId(req, res); 
});
router.get('/route/:routeId', async (req: Request, res: Response) => { 
    await vehicleAssignmentController.findVehicleAssignmentsByRouteId(req, res); 
});
router.get('/driver/:driverId', async (req: Request, res: Response) => { 
    await vehicleAssignmentController.findVehicleAssignmentsByDriverId(req, res); 
});

export default router;