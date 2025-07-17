import express, { Request, Response } from 'express';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const scheduleRepository = new ScheduleRepository(prisma);
const scheduleService = new ScheduleService(scheduleRepository);
const scheduleController = new ScheduleController(scheduleService);
const router = express.Router();

// Rutas principales del CRUD
router.get('/', async (req: Request, res: Response) => { 
    await scheduleController.findAllSchedules(req, res); 
});
router.get('/:id', async (req: Request, res: Response) => { 
    await scheduleController.findScheduleById(req, res); 
});
router.post('/create', async (req: Request, res: Response) => { 
    await scheduleController.createSchedule(req, res); 
});
router.put('/update/:id', async (req: Request, res: Response) => { 
    await scheduleController.updateSchedule(req, res); 
});
router.delete('/delete/:id', async (req: Request, res: Response) => { 
    await scheduleController.deleteSchedule(req, res); 
});

// Rutas adicionales para consultas específicas
router.get('/route/:routeId', async (req: Request, res: Response) => { 
    await scheduleController.findSchedulesByRouteId(req, res); 
});

export default router;
