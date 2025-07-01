import express, { Request, Response } from 'express';
import { VehicleLocationController } from './vehicle-location.controller';
import { VehicleLocationService } from './vehicle-location.service';
import { VehicleLocationRepository } from './vehicle-location.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const vehicleLocationRepository = new VehicleLocationRepository(prisma);
const vehicleLocationService = new VehicleLocationService(vehicleLocationRepository);
const vehicleLocationController = new VehicleLocationController(vehicleLocationService);
const router = express.Router();

// Obtener todas las ubicaciones de vehículos
router.get('/', async (req: Request, res: Response) => { 
    await vehicleLocationController.findAllVehicleLocations(req, res); 
});

// Obtener una ubicación de vehículo por ID
router.get('/:id', async (req: Request, res: Response) => { 
    await vehicleLocationController.findVehicleLocationById(req, res); 
});

// Obtener todas las ubicaciones de un vehículo específico
router.get('/vehicle/:vehicleId', async (req: Request, res: Response) => { 
    await vehicleLocationController.findVehicleLocationsByVehicleId(req, res); 
});

// Obtener la última ubicación de un vehículo específico
router.get('/vehicle/:vehicleId/latest', async (req: Request, res: Response) => { 
    await vehicleLocationController.findLatestVehicleLocationByVehicleId(req, res); 
});

// Crear una nueva ubicación de vehículo
router.post('/create', async (req: Request, res: Response) => { 
    await vehicleLocationController.createVehicleLocation(req, res); 
});

// Actualizar una ubicación de vehículo
router.put('/update/:id', async (req: Request, res: Response) => { 
    await vehicleLocationController.updateVehicleLocation(req, res); 
});

// Eliminar una ubicación de vehículo
router.delete('/delete/:id', async (req: Request, res: Response) => { 
    await vehicleLocationController.deleteVehicleLocation(req, res); 
});

export default router;
