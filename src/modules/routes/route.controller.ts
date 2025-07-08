import { Request, Response } from "express";
import { RouteServiceInterface } from "./interfaces/RouteService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateRouteDto } from "./dto/create-route.dto";
import { validate } from "class-validator";
import { UpdateRouteDto } from "./dto/update-route.dto";

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Gestión de rutas de transporte
 */

export class RouteController {
    constructor(private readonly routeService: RouteServiceInterface) {}

    /**
     * @swagger
     * /routes:
     *   get:
     *     summary: Obtener todas las rutas
     *     description: Obtiene una lista de todas las rutas disponibles
     *     tags: [Routes]
     *     responses:
     *       200:
     *         description: Lista de rutas obtenida exitosamente
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
     *                         $ref: '#/components/schemas/Route'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async findAllRoutes(_req: Request, res: Response): Promise<Response> {
        try {
            const routes = await this.routeService.findAllRoutes();
            return ApiResponse.success(res, routes, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /routes/{id}:
     *   get:
     *     summary: Obtener ruta por ID
     *     description: Obtiene una ruta específica por su ID
     *     tags: [Routes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID único de la ruta
     *         example: 1
     *     responses:
     *       200:
     *         description: Ruta encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Route'
     *       400:
     *         description: ID de ruta inválido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Ruta no encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async findRouteById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const route = await this.routeService.findRouteById(+id);
            return ApiResponse.success(res, route, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /routes/search:
     *   get:
     *     summary: Buscar rutas por nombre
     *     description: Busca rutas que coincidan con el nombre proporcionado
     *     tags: [Routes]
     *     parameters:
     *       - in: query
     *         name: name
     *         required: true
     *         schema:
     *           type: string
     *         description: Nombre de la ruta a buscar
     *         example: "Ruta Centro"
     *     responses:
     *       200:
     *         description: Rutas encontradas exitosamente
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
     *                         $ref: '#/components/schemas/Route'
     *       400:
     *         description: Nombre requerido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async findRoutesByName(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = req.query;
            if (!name || typeof name !== 'string') {
                return ApiResponse.error(res, "El nombre es requerido y debe ser una cadena de texto", 400);
            }
            const routes = await this.routeService.findRoutesByName(name);
            return ApiResponse.success(res, routes, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /routes:
     *   post:
     *     summary: Crear nueva ruta
     *     description: Crea una nueva ruta de transporte
     *     tags: [Routes]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - origin
     *               - destination
     *               - distance
     *               - estimatedTime
     *               - price
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nombre de la ruta
     *                 example: "Ruta Centro - Norte"
     *               description:
     *                 type: string
     *                 description: Descripción de la ruta
     *                 example: "Ruta que conecta el centro con la zona norte"
     *               origin:
     *                 type: string
     *                 description: Punto de origen
     *                 example: "Centro Comercial"
     *               destination:
     *                 type: string
     *                 description: Punto de destino
     *                 example: "Universidad Norte"
     *               distance:
     *                 type: number
     *                 description: Distancia en kilómetros
     *                 example: 15.5
     *               estimatedTime:
     *                 type: integer
     *                 description: Tiempo estimado en minutos
     *                 example: 30
     *               price:
     *                 type: number
     *                 description: Precio del viaje
     *                 example: 2.50
     *     responses:
     *       201:
     *         description: Ruta creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Route'
     *       400:
     *         description: Datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async createRoute(req: Request, res: Response): Promise<Response> {
        try {
            const routeData = plainToInstance(CreateRouteDto, req.body);
            const errors = await validate(routeData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newRoute = await this.routeService.createRoute(routeData);
            return ApiResponse.success(res, newRoute, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /routes/{id}:
     *   put:
     *     summary: Actualizar ruta
     *     description: Actualiza la información de una ruta existente
     *     tags: [Routes]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID único de la ruta
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nombre de la ruta
     *                 example: "Ruta Centro - Norte"
     *               description:
     *                 type: string
     *                 description: Descripción de la ruta
     *                 example: "Ruta que conecta el centro con la zona norte"
     *               origin:
     *                 type: string
     *                 description: Punto de origen
     *                 example: "Centro Comercial"
     *               destination:
     *                 type: string
     *                 description: Punto de destino
     *                 example: "Universidad Norte"
     *               distance:
     *                 type: number
     *                 description: Distancia en kilómetros
     *                 example: 15.5
     *               estimatedTime:
     *                 type: integer
     *                 description: Tiempo estimado en minutos
     *                 example: 30
     *               price:
     *                 type: number
     *                 description: Precio del viaje
     *                 example: 2.50
     *               isActive:
     *                 type: boolean
     *                 description: Indica si la ruta está activa
     *                 example: true
     *     responses:
     *       200:
     *         description: Ruta actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Route'
     *       400:
     *         description: Datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Ruta no encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async updateRoute(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const routeData = plainToInstance(UpdateRouteDto, req.body);
            const errors = await validate(routeData);
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
            const updatedRoute = await this.routeService.updateRoute(+id, routeData);
            return ApiResponse.success(res, updatedRoute, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /routes/{id}:
     *   delete:
     *     summary: Eliminar ruta
     *     description: Elimina una ruta del sistema
     *     tags: [Routes]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID único de la ruta a eliminar
     *         example: 1
     *     responses:
     *       200:
     *         description: Ruta eliminada exitosamente
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
     *                           example: "Ruta eliminada correctamente"
     *       400:
     *         description: ID de ruta inválido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Ruta no encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async deleteRoute(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.routeService.deleteRoute(+id);
            return ApiResponse.success(res, { message: "Ruta eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}