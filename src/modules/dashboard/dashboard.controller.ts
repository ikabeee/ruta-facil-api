import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { ApiResponse } from '../../shared/helpers/ApiResponse';
import { ApiError } from '../../shared/errors/ApiError';

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para el dashboard principal del sistema
 */
export class DashboardController {
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    /**
     * @swagger
     * /dashboard/stats:
     *   get:
     *     summary: Obtener estadísticas generales del dashboard
     *     description: Retorna estadísticas resumidas para el dashboard principal
     *     tags: [Dashboard]
     *     responses:
     *       200:
     *         description: Estadísticas obtenidas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: object
     *                   properties:
     *                     totalUsers:
     *                       type: number
     *                     activeDrivers:
     *                       type: number
     *                     totalRoutes:
     *                       type: number
     *                     activeVehicles:
     *                       type: number
     *                     totalIncidents:
     *                       type: number
     *                     averageRating:
     *                       type: number
     */
    async getStats(req: Request, res: Response): Promise<Response> {
        try {
            const stats = await this.dashboardService.getGeneralStats();
            return ApiResponse.success(res, stats, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /dashboard/live-routes:
     *   get:
     *     summary: Obtener estado de rutas en tiempo real
     *     description: Retorna el estado actual de todas las rutas activas
     *     tags: [Dashboard]
     *     responses:
     *       200:
     *         description: Estado de rutas obtenido exitosamente
     */
    async getLiveRoutes(req: Request, res: Response): Promise<Response> {
        try {
            const liveRoutes = await this.dashboardService.getLiveRoutesStatus();
            return ApiResponse.success(res, liveRoutes, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /dashboard/recent-incidents:
     *   get:
     *     summary: Obtener incidencias recientes
     *     description: Retorna las incidencias más recientes del sistema
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
    async getRecentIncidents(req: Request, res: Response): Promise<Response> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const incidents = await this.dashboardService.getRecentIncidents(limit);
            return ApiResponse.success(res, incidents, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /dashboard/ratings-summary:
     *   get:
     *     summary: Obtener resumen de calificaciones
     *     description: Retorna estadísticas de calificaciones por categoría
     *     tags: [Dashboard]
     *     responses:
     *       200:
     *         description: Resumen de calificaciones obtenido exitosamente
     */
    async getRatingsSummary(req: Request, res: Response): Promise<Response> {
        try {
            const ratingsSummary = await this.dashboardService.getRatingsSummary();
            return ApiResponse.success(res, ratingsSummary, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /dashboard/overview:
     *   get:
     *     summary: Obtener vista general del dashboard
     *     description: Retorna todos los datos necesarios para el dashboard en una sola llamada
     *     tags: [Dashboard]
     *     responses:
     *       200:
     *         description: Vista general obtenida exitosamente
     */
    async getOverview(req: Request, res: Response): Promise<Response> {
        try {
            const overview = await this.dashboardService.getOverview();
            return ApiResponse.success(res, overview, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * @swagger
     * /dashboard/efficiency-summary:
     *   get:
     *     summary: Obtener resumen de eficiencia del sistema
     *     description: Retorna métricas de eficiencia de conductores y rutas
     *     tags: [Dashboard]
     *     responses:
     *       200:
     *         description: Resumen de eficiencia obtenido exitosamente
     */
    async getEfficiencySummary(req: Request, res: Response): Promise<Response> {
        try {
            const efficiencySummary = await this.dashboardService.getEfficiencySummary();
            return ApiResponse.success(res, efficiencySummary, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }
}
