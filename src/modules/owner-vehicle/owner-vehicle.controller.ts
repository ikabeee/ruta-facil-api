import { Request, Response } from "express";
import { OwnerVehicleServiceInterface } from "./interfaces/OwnerVehicleService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateOwnerVehicleDto } from "./dto/create-owner-vehicle.dto";
import { validate } from "class-validator";
import { UpdateOwnerVehicleDto } from "./dto/update-owner-vehicle.dto";

/**
 * @swagger
 * tags:
 *   name: OwnerVehicles
 *   description: Gestión de relaciones entre propietarios y vehículos
 */

export class OwnerVehicleController {
    constructor(private readonly ownerVehicleService: OwnerVehicleServiceInterface) {}

    /**
     * @swagger
     * /owner-vehicles:
     *   get:
     *     summary: Obtener todas las relaciones propietario-vehículo
     *     description: Obtiene una lista de todas las relaciones entre propietarios y vehículos
     *     tags: [OwnerVehicles]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de relaciones obtenida exitosamente
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
     *                         $ref: '#/components/schemas/OwnerVehicle'
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async findAllOwnerVehicles(_req: Request, res: Response): Promise<Response> {
        try {
            const ownerVehicles = await this.ownerVehicleService.findAllOwnerVehicles();
            return ApiResponse.success(res, ownerVehicles, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /owner-vehicles/{id}:
     *   get:
     *     summary: Obtener una relación propietario-vehículo por ID
     *     description: Obtiene los detalles de una relación específica por su ID
     *     tags: [OwnerVehicles]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la relación
     *     responses:
     *       200:
     *         description: Relación encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/OwnerVehicle'
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Relación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findOwnerVehicleById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const ownerVehicle = await this.ownerVehicleService.findOwnerVehicleById(+id);
            return ApiResponse.success(res, ownerVehicle, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /owner-vehicles/user/{userId}:
     *   get:
     *     summary: Obtener vehículos por ID de propietario
     *     description: Obtiene todos los vehículos asociados a un propietario específico
     *     tags: [OwnerVehicles]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID del usuario propietario
     *     responses:
     *       200:
     *         description: Relaciones encontradas exitosamente
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
     *                         $ref: '#/components/schemas/OwnerVehicle'
     *       400:
     *         description: ID de usuario inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Usuario no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async findOwnerVehiclesByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+userId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const ownerVehicles = await this.ownerVehicleService.findOwnerVehiclesByUserId(+userId);
            return ApiResponse.success(res, ownerVehicles, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /owner-vehicles/vehicle/{vehicleId}:
     *   get:
     *     summary: Obtener propietarios por ID de vehículo
     *     description: Obtiene todos los propietarios asociados a un vehículo específico
     *     tags: [OwnerVehicles]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: vehicleId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID del vehículo
     *     responses:
     *       200:
     *         description: Relaciones encontradas exitosamente
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
     *                         $ref: '#/components/schemas/OwnerVehicle'
     *       400:
     *         description: ID de vehículo inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Vehículo no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async findOwnerVehiclesByVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { vehicleId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+vehicleId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const ownerVehicles = await this.ownerVehicleService.findOwnerVehiclesByVehicleId(+vehicleId);
            return ApiResponse.success(res, ownerVehicles, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /owner-vehicles/user/{userId}/vehicle/{vehicleId}:
     *   get:
     *     summary: Obtener relación específica por ID de usuario y vehículo
     *     description: Obtiene la relación entre un propietario y un vehículo específicos
     *     tags: [OwnerVehicles]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID del usuario propietario
     *       - in: path
     *         name: vehicleId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID del vehículo
     *     responses:
     *       200:
     *         description: Relación encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/OwnerVehicle'
     *       400:
     *         description: IDs inválidos
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Relación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findOwnerVehicleByUserIdAndVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { userId, vehicleId } = req.params;
            const userIdValidation = ValidateParams.validatePositiveInteger(+userId);
            const vehicleIdValidation = ValidateParams.validatePositiveInteger(+vehicleId);
            
            if (userIdValidation) {
                return ApiResponse.error(res, userIdValidation, 400);
            }
            if (vehicleIdValidation) {
                return ApiResponse.error(res, vehicleIdValidation, 400);
            }
            
            const ownerVehicle = await this.ownerVehicleService.findOwnerVehicleByUserIdAndVehicleId(+userId, +vehicleId);
            if (!ownerVehicle) {
                return ApiResponse.error(res, "No se encontró relación entre el usuario y el vehículo", 404);
            }
            return ApiResponse.success(res, ownerVehicle, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /owner-vehicles:
     *   post:
     *     summary: Crear una nueva relación propietario-vehículo
     *     description: Asigna un vehículo a un propietario
     *     tags: [OwnerVehicles]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateOwnerVehicleDto'
     *     responses:
     *       201:
     *         description: Relación creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/OwnerVehicle'
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async createOwnerVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const ownerVehicleData = plainToInstance(CreateOwnerVehicleDto, req.body);
            const errors = await validate(ownerVehicleData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newOwnerVehicle = await this.ownerVehicleService.createOwnerVehicle(ownerVehicleData);
            return ApiResponse.success(res, newOwnerVehicle, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /owner-vehicles/{id}:
     *   put:
     *     summary: Actualizar una relación propietario-vehículo
     *     description: Actualiza los detalles de una relación existente
     *     tags: [OwnerVehicles]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la relación a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateOwnerVehicleDto'
     *     responses:
     *       200:
     *         description: Relación actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/OwnerVehicle'
     *       400:
     *         description: Datos de entrada inválidos o ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Relación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async updateOwnerVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const ownerVehicleData = plainToInstance(UpdateOwnerVehicleDto, req.body);
            const errors = await validate(ownerVehicleData);
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
            const updatedOwnerVehicle = await this.ownerVehicleService.updateOwnerVehicle(+id, ownerVehicleData);
            return ApiResponse.success(res, updatedOwnerVehicle, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /owner-vehicles/{id}:
     *   delete:
     *     summary: Eliminar una relación propietario-vehículo
     *     description: Elimina una relación existente por su ID
     *     tags: [OwnerVehicles]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la relación a eliminar
     *     responses:
     *       200:
     *         description: Relación eliminada exitosamente
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
     *                           example: "Relación propietario-vehículo eliminada correctamente"
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Relación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async deleteOwnerVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.ownerVehicleService.deleteOwnerVehicle(+id);
            return ApiResponse.success(res, { message: "Relación propietario-vehículo eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
