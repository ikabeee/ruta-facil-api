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
            // Obtener el usuario actual del middleware de autenticación
            const currentUser = (req as any).user;
            let ownerId: number | undefined;

            // Si el usuario es OWNER_VEHICLE, filtrar por sus datos
            if (currentUser?.role === 'OWNER_VEHICLE') {
                ownerId = currentUser.id;
            }

            const stats = await this.dashboardService.getGeneralStats(ownerId);
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
            // Obtener el usuario actual del middleware de autenticación
            const currentUser = (req as any).user;
            let ownerId: number | undefined;

            // Si el usuario es OWNER_VEHICLE, filtrar por sus rutas
            if (currentUser?.role === 'OWNER_VEHICLE') {
                ownerId = currentUser.id;
            }

            const liveRoutes = await this.dashboardService.getLiveRoutesStatus(ownerId);
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
            
            // Obtener el usuario actual del middleware de autenticación
            const currentUser = (req as any).user;
            let ownerId: number | undefined;

            // Si el usuario es OWNER_VEHICLE, filtrar por sus incidentes
            if (currentUser?.role === 'OWNER_VEHICLE') {
                ownerId = currentUser.id;
            }

            const incidents = await this.dashboardService.getRecentIncidents(limit, ownerId);
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

    // ==================== ENDPOINTS ESPECÍFICOS PARA OWNER_VEHICLE ====================

    /**
     * @swagger
     * /dashboard/owner/stats:
     *   get:
     *     summary: Obtener estadísticas del propietario de unidades
     *     description: Retorna estadísticas específicas del propietario autenticado
     *     tags: [Dashboard, Owner]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Estadísticas del propietario obtenidas exitosamente
     */
    async getOwnerStats(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            
            if (currentUser?.role !== 'OWNER_VEHICLE') {
                return ApiResponse.error(res, 'Acceso denegado. Solo propietarios de vehículos pueden acceder.', 403);
            }

            const ownerId = currentUser.id;
            const stats = await this.dashboardService.getOwnerStats(ownerId);
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
     * /dashboard/owner/live-routes:
     *   get:
     *     summary: Obtener rutas en vivo del propietario
     *     description: Retorna el estado de las rutas del propietario autenticado
     *     tags: [Dashboard, Owner]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Rutas en vivo del propietario obtenidas exitosamente
     */
    async getOwnerLiveRoutes(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            
            if (currentUser?.role !== 'OWNER_VEHICLE') {
                return ApiResponse.error(res, 'Acceso denegado. Solo propietarios de vehículos pueden acceder.', 403);
            }

            const ownerId = currentUser.id;
            const liveRoutes = await this.dashboardService.getLiveRoutesStatus(ownerId);
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
     * /dashboard/owner/incidents:
     *   get:
     *     summary: Obtener incidencias del propietario
     *     description: Retorna las incidencias relacionadas con los vehículos del propietario
     *     tags: [Dashboard, Owner]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Número máximo de incidencias a retornar
     *     responses:
     *       200:
     *         description: Incidencias del propietario obtenidas exitosamente
     */
    async getOwnerIncidents(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            
            if (currentUser?.role !== 'OWNER_VEHICLE') {
                return ApiResponse.error(res, 'Acceso denegado. Solo propietarios de vehículos pueden acceder.', 403);
            }

            const limit = parseInt(req.query.limit as string) || 10;
            const ownerId = currentUser.id;
            const incidents = await this.dashboardService.getRecentIncidents(limit, ownerId);
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
     * /dashboard/owner/ratings:
     *   get:
     *     summary: Obtener resumen de calificaciones del propietario
     *     description: Retorna estadísticas de calificaciones de los vehículos del propietario
     *     tags: [Dashboard, Owner]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Resumen de calificaciones del propietario obtenido exitosamente
     */
    async getOwnerRatings(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            
            if (currentUser?.role !== 'OWNER_VEHICLE') {
                return ApiResponse.error(res, 'Acceso denegado. Solo propietarios de vehículos pueden acceder.', 403);
            }

            const ownerId = currentUser.id;
            const ratingsSummary = await this.dashboardService.getOwnerRatingsSummary(ownerId);
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
     * /dashboard/owner/overview:
     *   get:
     *     summary: Obtener vista general del dashboard del propietario
     *     description: Retorna todos los datos del dashboard específicos del propietario en una sola llamada
     *     tags: [Dashboard, Owner]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Vista general del propietario obtenida exitosamente
     */
    async getOwnerOverview(req: Request, res: Response): Promise<Response> {
        try {
            const currentUser = (req as any).user;
            
            if (currentUser?.role !== 'OWNER_VEHICLE') {
                return ApiResponse.error(res, 'Acceso denegado. Solo propietarios de vehículos pueden acceder.', 403);
            }

            const ownerId = currentUser.id;
            const overview = await this.dashboardService.getOwnerOverview(ownerId);
            return ApiResponse.success(res, overview, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }
}
