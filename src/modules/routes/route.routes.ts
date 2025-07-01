import express, { Request, Response } from 'express';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { RouteRepository } from './route.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const routeRepository = new RouteRepository(prisma);
const routeService = new RouteService(routeRepository);
const routeController = new RouteController(routeService);
const router = express.Router();

router.get('/', async (req: Request, res: Response) => { await routeController.findAllRoutes(req, res); });
router.get('/search', async (req: Request, res: Response) => { await routeController.findRoutesByName(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await routeController.findRouteById(req, res); });
router.post('/create', async (req: Request, res: Response) => { await routeController.createRoute(req, res); });
router.put('/update/:id', async (req: Request, res: Response) => { await routeController.updateRoute(req, res); });
router.delete('/delete/:id', async (req: Request, res: Response) => { await routeController.deleteRoute(req, res); });

export default router;