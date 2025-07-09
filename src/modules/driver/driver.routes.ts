import express, { Request, Response } from 'express';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { DriverRepository } from './driver.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const driverRepository = new DriverRepository(prisma);
const driverService = new DriverService(driverRepository);
const driverController = new DriverController(driverService);
const router = express.Router();

// Define the routes for the driver module
router.get('/', async (req: Request, res: Response) => { await driverController.findAllDrivers(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await driverController.findDriverById(req, res); });
router.get('/user/:userId', async (req: Request, res: Response) => { await driverController.findDriverByUserId(req, res); });
router.post('/create', async (req: Request, res: Response) => { await driverController.createDriver(req, res); });
router.put('/update/:id', async (req: Request, res: Response) => { await driverController.updateDriver(req, res); });
router.delete('/delete/:id', async (req: Request, res: Response) => { await driverController.deleteDriver(req, res); });

export default router;