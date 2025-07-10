import { Request, Response } from "express";
import { RatingServiceInterface } from "./interfaces/RatingService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { validate } from "class-validator";
import { UpdateRatingDto } from "./dto/update-rating.dto";

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Gestión de calificaciones del servicio
 */

export class RatingController {
    constructor(private readonly ratingService: RatingServiceInterface) {}

    /**
     * @swagger
     * /ratings:
     *   get:
     *     summary: Obtener todas las calificaciones
     *     description: Obtiene una lista de todas las calificaciones registradas
     *     tags: [Ratings]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de calificaciones obtenida exitosamente
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
     *                         $ref: '#/components/schemas/Rating'
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async findAllRatings(_req: Request, res: Response): Promise<Response> {
        try {
            const ratings = await this.ratingService.findAllRatings();
            return ApiResponse.success(res, ratings, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /ratings/{id}:
     *   get:
     *     summary: Obtener una calificación por ID
     *     description: Obtiene los detalles de una calificación específica por su ID
     *     tags: [Ratings]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la calificación
     *     responses:
     *       200:
     *         description: Calificación encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Rating'
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Calificación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findRatingById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const rating = await this.ratingService.findRatingById(+id);
            return ApiResponse.success(res, rating, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /ratings:
     *   post:
     *     summary: Crear una nueva calificación
     *     description: Registra una nueva calificación del servicio
     *     tags: [Ratings]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateRatingDto'
     *     responses:
     *       201:
     *         description: Calificación creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Rating'
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async createRating(req: Request, res: Response): Promise<Response> {
        try {
            const ratingData = plainToInstance(CreateRatingDto, req.body);
            const errors = await validate(ratingData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newRating = await this.ratingService.createRating(ratingData);
            return ApiResponse.success(res, newRating, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /ratings/{id}:
     *   put:
     *     summary: Actualizar una calificación
     *     description: Actualiza la información de una calificación existente
     *     tags: [Ratings]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la calificación a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateRatingDto'
     *     responses:
     *       200:
     *         description: Calificación actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Rating'
     *       400:
     *         description: Datos de entrada inválidos o ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Calificación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async updateRating(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const ratingData = plainToInstance(UpdateRatingDto, req.body);
            const errors = await validate(ratingData);
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
            const updatedRating = await this.ratingService.updateRating(+id, ratingData);
            return ApiResponse.success(res, updatedRating, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /ratings/{id}:
     *   delete:
     *     summary: Eliminar una calificación
     *     description: Elimina una calificación existente por su ID
     *     tags: [Ratings]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la calificación a eliminar
     *     responses:
     *       200:
     *         description: Calificación eliminada exitosamente
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
     *                           example: "Rating eliminado correctamente"
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Calificación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async deleteRating(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.ratingService.deleteRating(+id);
            return ApiResponse.success(res, { message: "Rating eliminado correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}