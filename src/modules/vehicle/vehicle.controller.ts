import { Request, Response } from "express";
import { VehicleServiceInterface } from "./interfaces/VehicleService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { validate } from "class-validator";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Gestión de vehículos del sistema
 */

export class VehicleController {
    constructor(private readonly vehicleService: VehicleServiceInterface) { }

    /**
     * @swagger
     * /vehicles:
     *   get:
     *     summary: Obtener todos los vehículos
     *     description: Obtiene una lista de todos los vehículos registrados
     *     tags: [Vehicles]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Lista de vehículos obtenida exitosamente
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
     *                         $ref: '#/components/schemas/Vehicle'
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
    async findAllVehicles(_req: Request, res: Response): Promise<Response> {
        try {
            const vehicles = await this.vehicleService.findAllVehicles();
            return ApiResponse.success(res, vehicles, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicles/{id}:
     *   get:
     *     summary: Obtener vehículo por ID
     *     description: Obtiene un vehículo específico por su ID
     *     tags: [Vehicles]
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
     *         description: ID único del vehículo
     *         example: 1
     *     responses:
     *       200:
     *         description: Vehículo encontrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Vehicle'
     *       400:
     *         description: ID de vehículo inválido
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
     *         description: Vehículo no encontrado
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
    async findVehicleById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicle = await this.vehicleService.findVehicleById(+id);
            return ApiResponse.success(res, vehicle, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicles/plate:
     *   post:
     *     summary: Buscar vehículo por placa
     *     description: Busca un vehículo específico por su placa
     *     tags: [Vehicles]
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
     *               - plate
     *             properties:
     *               plate:
     *                 type: string
     *                 description: Placa del vehículo
     *                 example: "ABC-123"
     *     responses:
     *       200:
     *         description: Vehículo encontrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Vehicle'
     *       400:
     *         description: Placa requerida
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
     *         description: Vehículo no encontrado
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
    async findVehicleByPlate(req: Request, res: Response): Promise<Response> {
        try {
            const { plate } = req.body;
            if (!plate) {
                return ApiResponse.error(res, "La placa es requerida", 400);
            }
            const vehicle = await this.vehicleService.findVehicleByPlate(plate);
            return ApiResponse.success(res, vehicle, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicles:
     *   post:
     *     summary: Crear nuevo vehículo
     *     description: Crea un nuevo vehículo en el sistema
     *     tags: [Vehicles]
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
     *               - licensePlate
     *               - brand
     *               - model
     *               - year
     *               - capacity
     *               - type
     *             properties:
     *               licensePlate:
     *                 type: string
     *                 description: Placa del vehículo
     *                 example: "ABC-123"
     *               brand:
     *                 type: string
     *                 description: Marca del vehículo
     *                 example: "Toyota"
     *               model:
     *                 type: string
     *                 description: Modelo del vehículo
     *                 example: "Hiace"
     *               year:
     *                 type: integer
     *                 description: Año del vehículo
     *                 example: 2020
     *               capacity:
     *                 type: integer
     *                 description: Capacidad de pasajeros
     *                 example: 15
     *               color:
     *                 type: string
     *                 description: Color del vehículo
     *                 example: "Blanco"
     *               type:
     *                 type: string
     *                 enum: [BUS, MINIBUS, VAN, TAXI]
     *                 description: Tipo de vehículo
     *                 example: "MINIBUS"
     *     responses:
     *       201:
     *         description: Vehículo creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Vehicle'
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
     *       409:
     *         description: La placa ya está en uso
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
    async createVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const vehicleData = plainToInstance(CreateVehicleDto, req.body);
            const errors = await validate(vehicleData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newVehicle = await this.vehicleService.createVehicle(vehicleData);
            return ApiResponse.success(res, newVehicle, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicles/{id}:
     *   put:
     *     summary: Actualizar vehículo
     *     description: Actualiza la información de un vehículo existente
     *     tags: [Vehicles]
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
     *         description: ID único del vehículo
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               licensePlate:
     *                 type: string
     *                 description: Placa del vehículo
     *                 example: "ABC-123"
     *               brand:
     *                 type: string
     *                 description: Marca del vehículo
     *                 example: "Toyota"
     *               model:
     *                 type: string
     *                 description: Modelo del vehículo
     *                 example: "Hiace"
     *               year:
     *                 type: integer
     *                 description: Año del vehículo
     *                 example: 2020
     *               capacity:
     *                 type: integer
     *                 description: Capacidad de pasajeros
     *                 example: 15
     *               color:
     *                 type: string
     *                 description: Color del vehículo
     *                 example: "Blanco"
     *               type:
     *                 type: string
     *                 enum: [BUS, MINIBUS, VAN, TAXI]
     *                 description: Tipo de vehículo
     *                 example: "MINIBUS"
     *               status:
     *                 type: string
     *                 enum: [ACTIVE, INACTIVE, MAINTENANCE]
     *                 description: Estado del vehículo
     *                 example: "ACTIVE"
     *     responses:
     *       200:
     *         description: Vehículo actualizado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Vehicle'
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
     *         description: Vehículo no encontrado
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
    async updateVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const vehicleData = plainToInstance(UpdateVehicleDto, req.body);
            const errors = await validate(vehicleData);
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
            const updatedVehicle = await this.vehicleService.updateVehicle(+id, vehicleData);
            return ApiResponse.success(res, updatedVehicle, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicles/{id}:
     *   delete:
     *     summary: Eliminar vehículo
     *     description: Elimina un vehículo del sistema
     *     tags: [Vehicles]
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
     *         description: ID único del vehículo a eliminar
     *         example: 1
     *     responses:
     *       200:
     *         description: Vehículo eliminado exitosamente
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
     *                           example: "Vehículo eliminado correctamente"
     *       400:
     *         description: ID de vehículo inválido
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
     *         description: Vehículo no encontrado
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
    async deleteVehicle(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.vehicleService.deleteVehicle(+id);
            return ApiResponse.success(res, { message: "Vehículo eliminado correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
