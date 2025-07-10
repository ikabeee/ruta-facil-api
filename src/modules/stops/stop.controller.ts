import { Request, Response } from "express";
import { StopServiceInterface } from "./interfaces/StopService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateStopDto } from "./dto/create-stop.dto";
import { validate } from "class-validator";
import { UpdateStopDto } from "./dto/update-stop.dto";

/**
 * @swagger
 * tags:
 *   name: Stops
 *   description: Gestión de paradas de transporte
 */

export class StopController {
    constructor(private readonly stopService: StopServiceInterface) {}

    /**
     * @swagger
     * /stops:
     *   get:
     *     summary: Obtener todas las paradas
     *     description: Obtiene una lista de todas las paradas disponibles
     *     tags: [Stops]
     *     responses:
     *       200:
     *         description: Lista de paradas obtenida exitosamente
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
     *                         $ref: '#/components/schemas/Stop'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    async findAllStops(_req: Request, res: Response): Promise<Response> {
        try {
            const stops = await this.stopService.findAllStops();
            return ApiResponse.success(res, stops, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /stops/{id}:
     *   get:
     *     summary: Obtener una parada por ID
     *     description: Obtiene los detalles de una parada específica por su ID
     *     tags: [Stops]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la parada
     *     responses:
     *       200:
     *         description: Parada encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Stop'
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Parada no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findStopById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const stop = await this.stopService.findStopById(+id);
            return ApiResponse.success(res, stop, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /stops:
     *   post:
     *     summary: Crear una nueva parada
     *     description: Crea una nueva parada con la información proporcionada
     *     tags: [Stops]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateStopDto'
     *     responses:
     *       201:
     *         description: Parada creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Stop'
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async createStop(req: Request, res: Response): Promise<Response> {
        try {
            const stopData = plainToInstance(CreateStopDto, req.body);
            const errors = await validate(stopData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newStop = await this.stopService.createStop(stopData);
            return ApiResponse.success(res, newStop, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /stops/{id}:
     *   put:
     *     summary: Actualizar una parada
     *     description: Actualiza la información de una parada existente
     *     tags: [Stops]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la parada a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateStopDto'
     *     responses:
     *       200:
     *         description: Parada actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Stop'
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Parada no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async updateStop(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const stopData = plainToInstance(UpdateStopDto, req.body);
            const errors = await validate(stopData);
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
            const updatedStop = await this.stopService.updateStop(+id, stopData);
            return ApiResponse.success(res, updatedStop, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /stops/{id}:
     *   delete:
     *     summary: Eliminar una parada
     *     description: Elimina una parada existente por su ID
     *     tags: [Stops]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la parada a eliminar
     *     responses:
     *       200:
     *         description: Parada eliminada exitosamente
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
     *                           example: "Parada eliminada correctamente"
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Parada no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async deleteStop(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.stopService.deleteStop(+id);
            return ApiResponse.success(res, { message: "Parada eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}