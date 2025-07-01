import express, { Request, Response } from 'express';
import { StarredRouteController } from './starred-route.controller';
import { StarredRouteService } from './starred-route.service';
import { StarredRouteRepository } from './starred-route.respository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const starredRouteRepository = new StarredRouteRepository(prisma);
const starredRouteService = new StarredRouteService(starredRouteRepository);
const starredRouteController = new StarredRouteController(starredRouteService);
const router = express.Router();

router.get('/', async (req: Request, res: Response) => { 
    await starredRouteController.findAllStarredRoutes(req, res); 
});
router.get('/:id', async (req: Request, res: Response) => { 
    await starredRouteController.findStarredRouteById(req, res); 
});
router.post('/create', async (req: Request, res: Response) => { 
    await starredRouteController.createStarredRoute(req, res); 
});
router.put('/update/:id', async (req: Request, res: Response) => { 
    await starredRouteController.updateStarredRoute(req, res); 
});
router.delete('/delete/:id', async (req: Request, res: Response) => { 
    await starredRouteController.deleteStarredRoute(req, res); 
});

export default router;