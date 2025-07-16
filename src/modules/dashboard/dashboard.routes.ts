import express, { Request, Response } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const dashboardController = new DashboardController();
const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas del dashboard
router.use(authMiddleware);

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Obtener estadísticas generales del dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
router.get('/stats', async (req: Request, res: Response) => {
    await dashboardController.getStats(req, res);
});

/**
 * @swagger
 * /dashboard/live-routes:
 *   get:
 *     summary: Obtener estado de rutas en tiempo real
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Estado de rutas obtenido exitosamente
 */
router.get('/live-routes', async (req: Request, res: Response) => {
    await dashboardController.getLiveRoutes(req, res);
});

/**
 * @swagger
 * /dashboard/recent-incidents:
 *   get:
 *     summary: Obtener incidencias recientes
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de incidencias a retornar
 *     responses:
 *       200:
 *         description: Incidencias recientes obtenidas exitosamente
 */
router.get('/recent-incidents', async (req: Request, res: Response) => {
    await dashboardController.getRecentIncidents(req, res);
});

/**
 * @swagger
 * /dashboard/ratings-summary:
 *   get:
 *     summary: Obtener resumen de calificaciones
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Resumen de calificaciones obtenido exitosamente
 */
router.get('/ratings-summary', async (req: Request, res: Response) => {
    await dashboardController.getRatingsSummary(req, res);
});

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Obtener vista general del dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Vista general obtenida exitosamente
 */
router.get('/overview', async (req: Request, res: Response) => {
    await dashboardController.getOverview(req, res);
});

/**
 * @swagger
 * /dashboard/efficiency-summary:
 *   get:
 *     summary: Obtener resumen de eficiencia del sistema
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Resumen de eficiencia obtenido exitosamente
 */
router.get('/efficiency-summary', async (req: Request, res: Response) => {
    await dashboardController.getEfficiencySummary(req, res);
});

export default router;
