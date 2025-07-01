import express, { Request, Response } from 'express';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleRepository } from './vehicle.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const vehicleRepository = new VehicleRepository(prisma);
const vehicleService = new VehicleService(vehicleRepository);
const vehicleController = new VehicleController(vehicleService);
const router = express.Router();

router.get('/', async (req: Request, res: Response) => { await vehicleController.findAllVehicles(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await vehicleController.findVehicleById(req, res); });
router.post('/find-by-plate', async (req: Request, res: Response) => { await vehicleController.findVehicleByPlate(req, res); });
router.post('/create', async (req: Request, res: Response) => { await vehicleController.createVehicle(req, res); });
router.put('/update/:id', async (req: Request, res: Response) => { await vehicleController.updateVehicle(req, res); });
router.delete('/delete/:id', async (req: Request, res: Response) => { await vehicleController.deleteVehicle(req, res); });

export default router;
