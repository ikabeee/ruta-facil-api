import { Request, Response } from 'express';
import { IncidentService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { ApiResponse } from '../../shared/helpers/ApiResponse';
import { ApiError } from '../../shared/errors/ApiError';

/**
 * @swagger
 * components:
 *   schemas:
 *     Incident:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - routeId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la incidencia
 *         title:
 *           type: string
 *           description: Título de la incidencia
 *         description:
 *           type: string
 *           description: Descripción detallada de la incidencia
 *         type:
 *           type: string
 *           description: Tipo de incidencia
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *           description: Prioridad de la incidencia
 *         location:
 *           type: string
 *           description: Ubicación donde ocurrió la incidencia
 *         unit:
 *           type: string
 *           description: Unidad o vehículo involucrado
 *         reportedBy:
 *           type: string
 *           description: Persona que reportó la incidencia
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, RESOLVED, CANCELLED]
 *           description: Estado actual de la incidencia
 *         routeId:
 *           type: integer
 *           description: ID de la ruta asociada
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *         route:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Nombre de la ruta
 *             code:
 *               type: string
 *               description: Código de la ruta
 *     
 *     CreateIncident:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - routeId
 *       properties:
 *         title:
 *           type: string
 *           description: Título de la incidencia
 *         description:
 *           type: string
 *           description: Descripción detallada de la incidencia
 *         type:
 *           type: string
 *           description: Tipo de incidencia
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *           default: MEDIUM
 *           description: Prioridad de la incidencia
 *         location:
 *           type: string
 *           description: Ubicación donde ocurrió la incidencia
 *         unit:
 *           type: string
 *           description: Unidad o vehículo involucrado
 *         reportedBy:
 *           type: string
 *           description: Persona que reportó la incidencia
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, RESOLVED, CANCELLED]
 *           default: PENDING
 *           description: Estado inicial de la incidencia
 *         routeId:
 *           type: integer
 *           description: ID de la ruta asociada
 *
 *     IncidentStats:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total de incidencias
 *         pending:
 *           type: integer
 *           description: Incidencias pendientes
 *         inProgress:
 *           type: integer
 *           description: Incidencias en progreso
 *         resolved:
 *           type: integer
 *           description: Incidencias resueltas
 *         cancelled:
 *           type: integer
 *           description: Incidencias canceladas
 *         byPriority:
 *           type: object
 *           properties:
 *             low:
 *               type: integer
 *             medium:
 *               type: integer
 *             high:
 *               type: integer
 *             critical:
 *               type: integer
 *         byTimeRange:
 *           type: object
 *           properties:
 *             today:
 *               type: integer
 *             thisWeek:
 *               type: integer
 *             thisMonth:
 *               type: integer
 *         mostAffectedRoutes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               routeId:
 *                 type: integer
 *               routeName:
 *                 type: string
 *               incidentCount:
 *                 type: integer
 *
 * tags:
 *   name: Incidents
 *   description: Gestión de incidencias del sistema de transporte
 */

export class IncidentController {
    private incidentService: IncidentService;

    constructor() {
        this.incidentService = new IncidentService();
    }

    /**
     * @swagger
     * /api/v1/incidents:
     *   get:
     *     summary: Obtener todas las incidencias
     *     tags: [Incidents]
     *     parameters:
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [PENDING, IN_PROGRESS, RESOLVED, CANCELLED]
     *         description: Filtrar por estado
     *       - in: query
     *         name: priority
     *         schema:
     *           type: string
     *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
     *         description: Filtrar por prioridad
     *       - in: query
     *         name: routeId
     *         schema:
     *           type: integer
     *         description: Filtrar por ID de ruta
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *         description: Filtrar por tipo de incidencia
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 50
     *         description: Límite de resultados
     *       - in: query
     *         name: offset
     *         schema:
     *           type: integer
     *           default: 0
     *         description: Desplazamiento para paginación
     *     responses:
     *       200:
     *         description: Lista de incidencias obtenida exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Incident'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const filters = {
                status: req.query.status as string,
                priority: req.query.priority as string,
                routeId: req.query.routeId ? parseInt(req.query.routeId as string) : undefined,
                type: req.query.type as string,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
                offset: req.query.offset ? parseInt(req.query.offset as string) : 0
            };

            const incidents = await this.incidentService.findAll(filters);
            ApiResponse.success(res, incidents);
        } catch (error) {
            if (error instanceof ApiError) {
                ApiResponse.error(res, error.message, error.statusCode);
            } else {
                ApiResponse.error(res, 'Error interno del servidor', 500);
            }
        }
    }

    /**
     * @swagger
     * /api/v1/incidents/{id}:
     *   get:
     *     summary: Obtener una incidencia por ID
     *     tags: [Incidents]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la incidencia
     *     responses:
     *       200:
     *         description: Incidencia encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Incident'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const incident = await this.incidentService.findOne(id);
            ApiResponse.success(res, incident);
        } catch (error) {
            if (error instanceof ApiError) {
                ApiResponse.error(res, error.message, error.statusCode);
            } else {
                ApiResponse.error(res, 'Error interno del servidor', 500);
            }
        }
    }

    /**
     * @swagger
     * /api/v1/incidents:
     *   post:
     *     summary: Crear una nueva incidencia
     *     tags: [Incidents]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateIncident'
     *     responses:
     *       201:
     *         description: Incidencia creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Incident'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const incidentData: CreateIncidentDto = req.body;
            const incident = await this.incidentService.create(incidentData);
            ApiResponse.success(res, incident, 201);
        } catch (error) {
            if (error instanceof ApiError) {
                ApiResponse.error(res, error.message, error.statusCode);
            } else {
                ApiResponse.error(res, 'Error interno del servidor', 500);
            }
        }
    }

    /**
     * @swagger
     * /api/v1/incidents/{id}:
     *   put:
     *     summary: Actualizar una incidencia
     *     tags: [Incidents]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la incidencia
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateIncident'
     *     responses:
     *       200:
     *         description: Incidencia actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Incident'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const updateData: UpdateIncidentDto = req.body;
            const incident = await this.incidentService.update(id, updateData);
            ApiResponse.success(res, incident);
        } catch (error) {
            if (error instanceof ApiError) {
                ApiResponse.error(res, error.message, error.statusCode);
            } else {
                ApiResponse.error(res, 'Error interno del servidor', 500);
            }
        }
    }

    /**
     * @swagger
     * /api/v1/incidents/{id}:
     *   delete:
     *     summary: Eliminar una incidencia
     *     tags: [Incidents]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la incidencia
     *     responses:
     *       200:
     *         description: Incidencia eliminada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await this.incidentService.remove(id);
            ApiResponse.success(res, null);
        } catch (error) {
            if (error instanceof ApiError) {
                ApiResponse.error(res, error.message, error.statusCode);
            } else {
                ApiResponse.error(res, 'Error interno del servidor', 500);
            }
        }
    }

    /**
     * @swagger
     * /api/v1/incidents/stats:
     *   get:
     *     summary: Obtener estadísticas de incidencias
     *     tags: [Incidents]
     *     responses:
     *       200:
     *         description: Estadísticas obtenidas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/IncidentStats'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async getStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.incidentService.getStats();
            ApiResponse.success(res, stats);
        } catch (error) {
            if (error instanceof ApiError) {
                ApiResponse.error(res, error.message, error.statusCode);
            } else {
                ApiResponse.error(res, 'Error interno del servidor', 500);
            }
        }
    }

    /**
     * @swagger
     * /api/v1/incidents/status/{status}:
     *   get:
     *     summary: Obtener incidencias por estado
     *     tags: [Incidents]
     *     parameters:
     *       - in: path
     *         name: status
     *         required: true
     *         schema:
     *           type: string
     *           enum: [PENDING, IN_PROGRESS, RESOLVED, CANCELLED]
     *         description: Estado de las incidencias
     *     responses:
     *       200:
     *         description: Incidencias obtenidas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Incident'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async getByStatus(req: Request, res: Response): Promise<void> {
        try {
            const status = req.params.status as string;
            const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'];
            if (!validStatuses.includes(status)) {
                ApiResponse.error(res, 'Estado de incidencia inválido', 400);
                return;
            }
            
            const incidents = await this.incidentService.getByStatus(status);
            ApiResponse.success(res, incidents);
        } catch (error) {
            if (error instanceof ApiError) {
                ApiResponse.error(res, error.message, error.statusCode);
            } else {
                ApiResponse.error(res, 'Error interno del servidor', 500);
            }
        }
    }

    /**
     * @swagger
     * /api/v1/incidents/priority/{priority}:
     *   get:
     *     summary: Obtener incidencias por prioridad
     *     tags: [Incidents]
     *     parameters:
     *       - in: path
     *         name: priority
     *         required: true
     *         schema:
     *           type: string
     *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
     *         description: Prioridad de las incidencias
     *     responses:
     *       200:
     *         description: Incidencias obtenidas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Incident'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async getByPriority(req: Request, res: Response): Promise<void> {
        try {
            const priority = req.params.priority as string;
            const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
            if (!validPriorities.includes(priority)) {
                ApiResponse.error(res, 'Prioridad de incidencia inválida', 400);
                return;
            }
            
            const incidents = await this.incidentService.getByPriority(priority);
            ApiResponse.success(res, incidents);
        } catch (error) {
            if (error instanceof ApiError) {
                ApiResponse.error(res, error.message, error.statusCode);
            } else {
                ApiResponse.error(res, 'Error interno del servidor', 500);
            }
        }
    }

    /**
     * @swagger
     * /api/v1/incidents/route/{routeId}:
     *   get:
     *     summary: Obtener incidencias por ruta
     *     tags: [Incidents]
     *     parameters:
     *       - in: path
     *         name: routeId
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la ruta
     *     responses:
     *       200:
     *         description: Incidencias obtenidas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Incident'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    async getByRoute(req: Request, res: Response): Promise<void> {
        try {
            const routeId = parseInt(req.params.routeId);
            if (isNaN(routeId)) {
                ApiResponse.error(res, 'ID de ruta inválido', 400);
                return;
            }
            
            const incidents = await this.incidentService.getByRoute(routeId);
            ApiResponse.success(res, incidents);
        } catch (error) {
            if (error instanceof ApiError) {
                ApiResponse.error(res, error.message, error.statusCode);
            } else {
                ApiResponse.error(res, 'Error interno del servidor', 500);
            }
        }
    }
}
