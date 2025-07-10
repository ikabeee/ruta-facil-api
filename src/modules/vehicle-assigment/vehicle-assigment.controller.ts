import { Request, Response } from "express";
import { VehicleAssignmentServiceInterface } from "./interfaces/VehicleAssignmentService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateVehicleAssignmentDto } from "./dto/create-vehicle-assignment.dto";
import { validate } from "class-validator";
import { UpdateVehicleAssignmentDto } from "./dto/update-vehicle-assignment.dto";

/**
 * @swagger
 * tags:
 *   name: VehicleAssignments
 *   description: Gestión de asignaciones de vehículos a rutas y conductores
 */

export class VehicleAssignmentController {
    constructor(private readonly vehicleAssignmentService: VehicleAssignmentServiceInterface) {}

    /**
     * @swagger
     * /vehicle-assignments:
     *   get:
     *     summary: Obtener todas las asignaciones de vehículos
     *     description: Obtiene una lista de todas las asignaciones de vehículos registradas
     *     tags: [VehicleAssignments]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de asignaciones obtenida exitosamente
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
     *                         $ref: '#/components/schemas/VehicleAssignment'
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async findAllVehicleAssignments(_req: Request, res: Response): Promise<Response> {
        try {
            const vehicleAssignments = await this.vehicleAssignmentService.findAllVehicleAssignments();
            return ApiResponse.success(res, vehicleAssignments, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-assignments/{id}:
     *   get:
     *     summary: Obtener asignación de vehículo por ID
     *     description: Obtiene una asignación específica por su ID
     *     tags: [VehicleAssignments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la asignación
     *     responses:
     *       200:
     *         description: Asignación encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/VehicleAssignment'
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Asignación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findVehicleAssignmentById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleAssignment = await this.vehicleAssignmentService.findVehicleAssignmentById(+id);
            return ApiResponse.success(res, vehicleAssignment, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-assignments/vehicle/{vehicleId}:
     *   get:
     *     summary: Obtener asignaciones por ID de vehículo
     *     description: Obtiene todas las asignaciones registradas para un vehículo específico
     *     tags: [VehicleAssignments]
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
     *         description: Asignaciones encontradas exitosamente
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
     *                         $ref: '#/components/schemas/VehicleAssignment'
     *       400:
     *         description: ID de vehículo inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Vehículo no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async findVehicleAssignmentsByVehicleId(req: Request, res: Response): Promise<Response> {
        try {
            const { vehicleId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+vehicleId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleAssignments = await this.vehicleAssignmentService.findVehicleAssignmentsByVehicleId(+vehicleId);
            return ApiResponse.success(res, vehicleAssignments, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-assignments/route/{routeId}:
     *   get:
     *     summary: Obtener asignaciones por ID de ruta
     *     description: Obtiene todas las asignaciones registradas para una ruta específica
     *     tags: [VehicleAssignments]
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
     *         description: Asignaciones encontradas exitosamente
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
     *                         $ref: '#/components/schemas/VehicleAssignment'
     *       400:
     *         description: ID de ruta inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Ruta no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findVehicleAssignmentsByRouteId(req: Request, res: Response): Promise<Response> {
        try {
            const { routeId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+routeId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleAssignments = await this.vehicleAssignmentService.findVehicleAssignmentsByRouteId(+routeId);
            return ApiResponse.success(res, vehicleAssignments, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-assignments/driver/{driverId}:
     *   get:
     *     summary: Obtener asignaciones por ID de conductor
     *     description: Obtiene todas las asignaciones registradas para un conductor específico
     *     tags: [VehicleAssignments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: driverId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID del conductor
     *     responses:
     *       200:
     *         description: Asignaciones encontradas exitosamente
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
     *                         $ref: '#/components/schemas/VehicleAssignment'
     *       400:
     *         description: ID de conductor inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Conductor no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async findVehicleAssignmentsByDriverId(req: Request, res: Response): Promise<Response> {
        try {
            const { driverId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+driverId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const vehicleAssignments = await this.vehicleAssignmentService.findVehicleAssignmentsByDriverId(+driverId);
            return ApiResponse.success(res, vehicleAssignments, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-assignments:
     *   post:
     *     summary: Crear una nueva asignación de vehículo
     *     description: Registra una nueva asignación de vehículo a una ruta y conductor
     *     tags: [VehicleAssignments]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateVehicleAssignmentDto'
     *     responses:
     *       201:
     *         description: Asignación creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/VehicleAssignment'
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async createVehicleAssignment(req: Request, res: Response): Promise<Response> {
        try {
            const assignmentData = plainToInstance(CreateVehicleAssignmentDto, req.body);
            const errors = await validate(assignmentData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newVehicleAssignment = await this.vehicleAssignmentService.createVehicleAssignment(assignmentData);
            return ApiResponse.success(res, newVehicleAssignment, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-assignments/{id}:
     *   put:
     *     summary: Actualizar una asignación de vehículo
     *     description: Actualiza la información de una asignación existente
     *     tags: [VehicleAssignments]
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
     *             $ref: '#/components/schemas/UpdateVehicleAssignmentDto'
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
     *                       $ref: '#/components/schemas/VehicleAssignment'
     *       400:
     *         description: Datos de entrada inválidos o ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Asignación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async updateVehicleAssignment(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const assignmentData = plainToInstance(UpdateVehicleAssignmentDto, req.body);
            const errors = await validate(assignmentData);
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
            const updatedVehicleAssignment = await this.vehicleAssignmentService.updateVehicleAssignment(+id, assignmentData);
            return ApiResponse.success(res, updatedVehicleAssignment, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /vehicle-assignments/{id}:
     *   delete:
     *     summary: Eliminar una asignación de vehículo
     *     description: Elimina una asignación existente por su ID
     *     tags: [VehicleAssignments]
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
     *                           example: "Asignación de vehículo eliminada correctamente"
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Asignación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async deleteVehicleAssignment(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.vehicleAssignmentService.deleteVehicleAssignment(+id);
            return ApiResponse.success(res, { message: "Asignación de vehículo eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
