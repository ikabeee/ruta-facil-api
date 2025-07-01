import express, { Request, Response } from 'express';
import { OwnerVehicleController } from './owner-vehicle.controller';
import { OwnerVehicleService } from './owner-vehicle.service';
import { OwnerVehicleRepository } from './owner-vehicle.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const ownerVehicleRepository = new OwnerVehicleRepository(prisma);
const ownerVehicleService = new OwnerVehicleService(ownerVehicleRepository);
const ownerVehicleController = new OwnerVehicleController(ownerVehicleService);
const router = express.Router();

router.get('/', async (req: Request, res: Response) => { await ownerVehicleController.findAllOwnerVehicles(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await ownerVehicleController.findOwnerVehicleById(req, res); });
router.get('/user/:userId', async (req: Request, res: Response) => { await ownerVehicleController.findOwnerVehiclesByUserId(req, res); });
router.get('/vehicle/:vehicleId', async (req: Request, res: Response) => { await ownerVehicleController.findOwnerVehiclesByVehicleId(req, res); });
router.get('/user/:userId/vehicle/:vehicleId', async (req: Request, res: Response) => { await ownerVehicleController.findOwnerVehicleByUserIdAndVehicleId(req, res); });
router.post('/create', async (req: Request, res: Response) => { await ownerVehicleController.createOwnerVehicle(req, res); });
router.put('/update/:id', async (req: Request, res: Response) => { await ownerVehicleController.updateOwnerVehicle(req, res); });
router.delete('/delete/:id', async (req: Request, res: Response) => { await ownerVehicleController.deleteOwnerVehicle(req, res); });

export default router;
