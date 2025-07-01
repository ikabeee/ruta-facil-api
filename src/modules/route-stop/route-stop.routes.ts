import express, { Request, Response } from 'express';
import { RouteStopController } from './route-stop.controller';
import { RouteStopService } from './route-stop.service';
import { RouteStopRepository } from './route-stop.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const routeStopRepository = new RouteStopRepository(prisma);
const routeStopService = new RouteStopService(routeStopRepository);
const routeStopController = new RouteStopController(routeStopService);
const router = express.Router();

// Obtener todos los route-stops
router.get('/', async (req: Request, res: Response) => { 
    await routeStopController.findAllRouteStops(req, res); 
});

// Obtener route-stop por ID
router.get('/:id', async (req: Request, res: Response) => { 
    await routeStopController.findRouteStopById(req, res); 
});

// Obtener route-stops por ID de ruta
router.get('/route/:routeId', async (req: Request, res: Response) => { 
    await routeStopController.findRouteStopsByRouteId(req, res); 
});

// Obtener route-stops por ID de parada
router.get('/stop/:stopId', async (req: Request, res: Response) => { 
    await routeStopController.findRouteStopsByStopId(req, res); 
});

// Crear nuevo route-stop
router.post('/create', async (req: Request, res: Response) => { 
    await routeStopController.createRouteStop(req, res); 
});

// Actualizar route-stop
router.put('/update/:id', async (req: Request, res: Response) => { 
    await routeStopController.updateRouteStop(req, res); 
});

// Eliminar route-stop
router.delete('/delete/:id', async (req: Request, res: Response) => { 
    await routeStopController.deleteRouteStop(req, res); 
});

export default router;