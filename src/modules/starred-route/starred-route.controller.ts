import { Request, Response } from "express";
import { StarredRouteServiceInterface } from "./interfaces/StarredRouteService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateStarredRouteDto } from "./dto/create-starred-route.dto";
import { validate } from "class-validator";
import { UpdateStarredRouteDto } from "./dto/update-starred-route.dto";

/**
 * @swagger
 * tags:
 *   name: StarredRoutes
 *   description: Gestión de rutas favoritas de usuarios
 */

export class StarredRouteController {
    constructor(private readonly starredRouteService: StarredRouteServiceInterface) {}

    /**
     * @swagger
     * /starred-routes:
     *   get:
     *     summary: Obtener todas las rutas favoritas
     *     description: Obtiene una lista de todas las rutas marcadas como favoritas
     *     tags: [StarredRoutes]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de rutas favoritas obtenida exitosamente
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
     *                         $ref: '#/components/schemas/StarredRoute'
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async findAllStarredRoutes(_req: Request, res: Response): Promise<Response> {
        try {
            const starredRoutes = await this.starredRouteService.findAllStarredRoutes();
            return ApiResponse.success(res, starredRoutes, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /starred-routes/{id}:
     *   get:
     *     summary: Obtener una ruta favorita por ID
     *     description: Obtiene los detalles de una ruta favorita específica por su ID
     *     tags: [StarredRoutes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la ruta favorita
     *     responses:
     *       200:
     *         description: Ruta favorita encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/StarredRoute'
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Ruta favorita no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findStarredRouteById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const starredRoute = await this.starredRouteService.findStarredRouteById(+id);
            return ApiResponse.success(res, starredRoute, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /starred-routes:
     *   post:
     *     summary: Crear una nueva ruta favorita
     *     description: Marca una ruta como favorita para un usuario
     *     tags: [StarredRoutes]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateStarredRouteDto'
     *     responses:
     *       201:
     *         description: Ruta marcada como favorita exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/StarredRoute'
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async createStarredRoute(req: Request, res: Response): Promise<Response> {
        try {
            const starredRouteData = plainToInstance(CreateStarredRouteDto, req.body);
            const errors = await validate(starredRouteData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newStarredRoute = await this.starredRouteService.createStarredRoute(starredRouteData);
            return ApiResponse.success(res, newStarredRoute, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /starred-routes/{id}:
     *   put:
     *     summary: Actualizar una ruta favorita
     *     description: Actualiza los detalles de una ruta favorita existente
     *     tags: [StarredRoutes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la ruta favorita a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateStarredRouteDto'
     *     responses:
     *       200:
     *         description: Ruta favorita actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/StarredRoute'
     *       400:
     *         description: Datos de entrada inválidos o ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Ruta favorita no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async updateStarredRoute(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const starredRouteData = plainToInstance(UpdateStarredRouteDto, req.body);
            const errors = await validate(starredRouteData);
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
            const updatedStarredRoute = await this.starredRouteService.updateStarredRoute(+id, starredRouteData);
            return ApiResponse.success(res, updatedStarredRoute, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /starred-routes/{id}:
     *   delete:
     *     summary: Eliminar una ruta favorita
     *     description: Elimina una ruta de las favoritas del usuario
     *     tags: [StarredRoutes]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la ruta favorita a eliminar
     *     responses:
     *       200:
     *         description: Ruta favorita eliminada exitosamente
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
     *                           example: "Ruta favorita eliminada correctamente"
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Ruta favorita no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async deleteStarredRoute(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.starredRouteService.deleteStarredRoute(+id);
            return ApiResponse.success(res, { message: "Ruta favorita eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}