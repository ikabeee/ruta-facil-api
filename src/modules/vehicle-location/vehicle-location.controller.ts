import { Request, Response } from "express";
import { VehicleLocationServiceInterface } from "./interfaces/VehicleLocationService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateVehicleLocationDto } from "./dto/create-vehicle-location.dto";
import { validate } from "class-validator";
import { UpdateVehicleLocationDto } from "./dto/update-vehicle-location.dto";

/**
 * @swagger
 * tags:
 *   name: VehicleLocations
 *   description: Gestión de ubicaciones de vehículos
 */

export class VehicleLocationController {
    constructor(private readonly vehicleLocationService: VehicleLocationServiceInterface) { }

    /**
     * @swagger
     * /vehicle-locations:
     *   get:
     *     summary: Obtener todas las ubicaciones de vehículos
     *     description: Obtiene una lista de todas las ubicaciones de vehículos registradas
     *     tags: [VehicleLocations]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de ubicaciones obtenida exitosamente
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
     *                         $ref: '#/components/schemas/VehicleLocation'
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async findAllVehicleLocations(_req: Request, res: Response): Promise<Response> {
        try {
            const vehicleLocations = await this.vehicleLocationService.findAllVehicleLocations();
            return ApiResponse.success(res, vehicleLocations, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-locations/{id}:
     *   get:
     *     summary: Obtener ubicación de vehículo por ID
     *     description: Obtiene una ubicación específica por su ID
     *     tags: [VehicleLocations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la ubicación
     *     responses:
     *       200:
     *         description: Ubicación encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/VehicleLocation'
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Ubicación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findVehicleLocationById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleLocation = await this.vehicleLocationService.findVehicleLocationById(+id);
            return ApiResponse.success(res, vehicleLocation, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-locations/vehicle/{vehicleId}:
     *   get:
     *     summary: Obtener ubicaciones por ID de vehículo
     *     description: Obtiene todas las ubicaciones registradas para un vehículo específico
     *     tags: [VehicleLocations]
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
     *         description: Ubicaciones encontradas exitosamente
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
     *                         $ref: '#/components/schemas/VehicleLocation'
     *       400:
     *         description: ID de vehículo inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Vehículo no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async findVehicleLocationsByVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { vehicleId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+vehicleId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleLocations = await this.vehicleLocationService.findVehicleLocationsByVehicleId(+vehicleId);
            return ApiResponse.success(res, vehicleLocations, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-locations/vehicle/{vehicleId}/latest:
     *   get:
     *     summary: Obtener última ubicación de un vehículo
     *     description: Obtiene la ubicación más reciente registrada para un vehículo específico
     *     tags: [VehicleLocations]
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
     *         description: Última ubicación encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/VehicleLocation'
     *       400:
     *         description: ID de vehículo inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Vehículo no encontrado o sin ubicaciones
     *       500:
     *         description: Error interno del servidor
     */
    async findLatestVehicleLocationByVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { vehicleId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+vehicleId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleLocation = await this.vehicleLocationService.findLatestVehicleLocationByVehicleId(+vehicleId);
            return ApiResponse.success(res, vehicleLocation, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-locations:
     *   post:
     *     summary: Crear una nueva ubicación de vehículo
     *     description: Registra una nueva ubicación para un vehículo
     *     tags: [VehicleLocations]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateVehicleLocationDto'
     *     responses:
     *       201:
     *         description: Ubicación creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/VehicleLocation'
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async createVehicleLocation(req: Request, res: Response): Promise<Response> {
        try {
            const vehicleLocationData = plainToInstance(CreateVehicleLocationDto, req.body);
            const errors = await validate(vehicleLocationData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newVehicleLocation = await this.vehicleLocationService.createVehicleLocation(vehicleLocationData);
            return ApiResponse.success(res, newVehicleLocation, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-locations/{id}:
     *   put:
     *     summary: Actualizar una ubicación de vehículo
     *     description: Actualiza la información de una ubicación existente
     *     tags: [VehicleLocations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la ubicación a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateVehicleLocationDto'
     *     responses:
     *       200:
     *         description: Ubicación actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/VehicleLocation'
     *       400:
     *         description: Datos de entrada inválidos o ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Ubicación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async updateVehicleLocation(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const vehicleLocationData = plainToInstance(UpdateVehicleLocationDto, req.body);
            const errors = await validate(vehicleLocationData);
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
            const updatedVehicleLocation = await this.vehicleLocationService.updateVehicleLocation(+id, vehicleLocationData);
            return ApiResponse.success(res, updatedVehicleLocation, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-locations/{id}:
     *   delete:
     *     summary: Eliminar una ubicación de vehículo
     *     description: Elimina una ubicación existente por su ID
     *     tags: [VehicleLocations]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la ubicación a eliminar
     *     responses:
     *       200:
     *         description: Ubicación eliminada exitosamente
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
     *                           example: "Ubicación de vehículo eliminada correctamente"
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Ubicación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async deleteVehicleLocation(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.vehicleLocationService.deleteVehicleLocation(+id);
            return ApiResponse.success(res, { message: "Ubicación de vehículo eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
