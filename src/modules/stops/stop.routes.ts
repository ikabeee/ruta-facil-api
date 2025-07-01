import express, { Request, Response } from 'express';
import { StopController } from './stop.controller';
import { StopService } from './stop.service';
import { StopRepository } from './stop.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const stopRepository = new StopRepository(prisma);
const stopService = new StopService(stopRepository);
const stopController = new StopController(stopService);
const router = express.Router();

router.get('/', async (req: Request, res: Response) => { await stopController.findAllStops(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await stopController.findStopById(req, res); });
router.post('/create', async (req: Request, res: Response) => { await stopController.createStop(req, res); });
router.put('/update/:id', async (req: Request, res: Response) => { await stopController.updateStop(req, res); });
router.delete('/delete/:id', async (req: Request, res: Response) => { await stopController.deleteStop(req, res); });

export default router;