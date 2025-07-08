import { Request, Response } from "express";
import { RouteStopServiceInterface } from "./interfaces/RouteStopService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateRouteStopDto } from "./dto/create-route-stop.dto";
import { validate } from "class-validator";
import { UpdateRouteStopDto } from "./dto/update-route-stop.dto";

/**
 * @swagger
 * tags:
 *   name: RouteStops
 *   description: Gestión de paradas en rutas de transporte
 */

export class RouteStopController {
    constructor(private readonly routeStopService: RouteStopServiceInterface) {}

    /**
     * @swagger
     * /route-stops:
     *   get:
     *     summary: Obtener todas las paradas de rutas
     *     description: Obtiene una lista de todas las asignaciones de paradas a rutas
     *     tags: [RouteStops]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de paradas de rutas obtenida exitosamente
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
     *                         $ref: '#/components/schemas/RouteStop'
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async findAllRouteStops(_req: Request, res: Response): Promise<Response> {
        try {
            const routeStops = await this.routeStopService.findAllRouteStops();
            return ApiResponse.success(res, routeStops, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /route-stops/{id}:
     *   get:
     *     summary: Obtener una parada de ruta por ID
     *     description: Obtiene los detalles de una asignación específica de parada en ruta por su ID
     *     tags: [RouteStops]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la asignación de parada en ruta
     *     responses:
     *       200:
     *         description: Parada de ruta encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/RouteStop'
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Parada de ruta no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findRouteStopById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const routeStop = await this.routeStopService.findRouteStopById(+id);
            return ApiResponse.success(res, routeStop, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /route-stops/route/{routeId}:
     *   get:
     *     summary: Obtener paradas por ID de ruta
     *     description: Obtiene todas las paradas asignadas a una ruta específica
     *     tags: [RouteStops]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: routeId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la ruta
     *     responses:
     *       200:
     *         description: Paradas de ruta encontradas exitosamente
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
     *                         $ref: '#/components/schemas/RouteStop'
     *       400:
     *         description: ID de ruta inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Ruta no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findRouteStopsByRouteId(req: Request, res: Response): Promise<Response> {
        try {
            const { routeId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+routeId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const routeStops = await this.routeStopService.findRouteStopsByRouteId(+routeId);
            return ApiResponse.success(res, routeStops, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /route-stops/stop/{stopId}:
     *   get:
     *     summary: Obtener rutas por ID de parada
     *     description: Obtiene todas las rutas asignadas a una parada específica
     *     tags: [RouteStops]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: stopId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la parada
     *     responses:
     *       200:
     *         description: Rutas de parada encontradas exitosamente
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
     *                         $ref: '#/components/schemas/RouteStop'
     *       400:
     *         description: ID de parada inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Parada no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findRouteStopsByStopId(req: Request, res: Response): Promise<Response> {
        try {
            const { stopId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+stopId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const routeStops = await this.routeStopService.findRouteStopsByStopId(+stopId);
            return ApiResponse.success(res, routeStops, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /route-stops:
     *   post:
     *     summary: Crear una nueva asignación de parada en ruta
     *     description: Asigna una parada a una ruta con un orden específico
     *     tags: [RouteStops]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateRouteStopDto'
     *     responses:
     *       201:
     *         description: Parada asignada a ruta exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/RouteStop'
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async createRouteStop(req: Request, res: Response): Promise<Response> {
        try {
            const routeStopData = plainToInstance(CreateRouteStopDto, req.body);
            const errors = await validate(routeStopData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newRouteStop = await this.routeStopService.createRouteStop(routeStopData);
            return ApiResponse.success(res, newRouteStop, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /route-stops/{id}:
     *   put:
     *     summary: Actualizar una asignación de parada en ruta
     *     description: Actualiza los detalles de una asignación existente de parada en ruta
     *     tags: [RouteStops]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la asignación a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateRouteStopDto'
     *     responses:
     *       200:
     *         description: Asignación actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/RouteStop'
     *       400:
     *         description: Datos de entrada inválidos o ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Asignación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async updateRouteStop(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const routeStopData = plainToInstance(UpdateRouteStopDto, req.body);
            const errors = await validate(routeStopData);
            const validationError = ValidateParams.validatePositiveInteger(+id);

            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }

            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const updatedRouteStop = await this.routeStopService.updateRouteStop(+id, routeStopData);
            return ApiResponse.success(res, updatedRouteStop, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /route-stops/{id}:
     *   delete:
     *     summary: Eliminar una asignación de parada en ruta
     *     description: Elimina una asignación existente de parada en ruta
     *     tags: [RouteStops]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la asignación a eliminar
     *     responses:
     *       200:
     *         description: Asignación eliminada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         message:
     *                           type: string
     *                           example: "RouteStop eliminado correctamente"
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Asignación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async deleteRouteStop(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.routeStopService.deleteRouteStop(+id);
            return ApiResponse.success(res, { message: "RouteStop eliminado correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}