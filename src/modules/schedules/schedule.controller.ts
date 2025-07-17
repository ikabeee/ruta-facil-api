import { Request, Response } from "express";
import { ScheduleServiceInterface } from "./interfaces/ScheduleService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { validate } from "class-validator";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Gestión de horarios de rutas
 */

export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleServiceInterface) {}

    /**
     * @swagger
     * /schedules:
     *   get:
     *     summary: Obtener todos los horarios
     *     description: Obtiene una lista de todos los horarios del sistema
     *     tags: [Schedules]
     *     responses:
     *       200:
     *         description: Lista de horarios obtenida exitosamente
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
     *                         $ref: '#/components/schemas/Schedule'
     *       500:
     *         description: Error interno del servidor
     */
    async findAllSchedules(_req: Request, res: Response): Promise<Response> {
        try {
            const schedules = await this.scheduleService.findAllSchedules();
            return ApiResponse.success(res, schedules, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /schedules/{id}:
     *   get:
     *     summary: Obtener horario por ID
     *     description: Obtiene un horario específico por su ID
     *     tags: [Schedules]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID único del horario
     *         example: 1
     *     responses:
     *       200:
     *         description: Horario encontrado exitosamente
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Horario no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async findScheduleById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const schedule = await this.scheduleService.findScheduleById(+id);
            return ApiResponse.success(res, schedule, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /schedules/create:
     *   post:
     *     summary: Crear nuevo horario
     *     description: Crea un nuevo horario en el sistema
     *     tags: [Schedules]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateScheduleDto'
     *     responses:
     *       201:
     *         description: Horario creado exitosamente
     *       400:
     *         description: Datos de entrada inválidos
     *       500:
     *         description: Error interno del servidor
     */
    async createSchedule(req: Request, res: Response): Promise<Response> {
        try {
            const scheduleData = plainToInstance(CreateScheduleDto, req.body);
            const errors = await validate(scheduleData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newSchedule = await this.scheduleService.createSchedule(scheduleData);
            return ApiResponse.success(res, newSchedule, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /schedules/update/{id}:
     *   put:
     *     summary: Actualizar horario
     *     description: Actualiza la información de un horario existente
     *     tags: [Schedules]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID único del horario
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateScheduleDto'
     *     responses:
     *       200:
     *         description: Horario actualizado exitosamente
     *       400:
     *         description: ID o datos inválidos
     *       404:
     *         description: Horario no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async updateSchedule(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const scheduleData = plainToInstance(UpdateScheduleDto, req.body);
            const errors = await validate(scheduleData);
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
            const updatedSchedule = await this.scheduleService.updateSchedule(+id, scheduleData);
            return ApiResponse.success(res, updatedSchedule, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /schedules/delete/{id}:
     *   delete:
     *     summary: Eliminar horario
     *     description: Elimina un horario del sistema
     *     tags: [Schedules]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID único del horario
     *         example: 1
     *     responses:
     *       200:
     *         description: Horario eliminado exitosamente
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Horario no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async deleteSchedule(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.scheduleService.deleteSchedule(+id);
            return ApiResponse.success(res, { message: "Horario eliminado correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /schedules/route/{routeId}:
     *   get:
     *     summary: Obtener horarios por ruta
     *     description: Obtiene todos los horarios asociados a una ruta específica
     *     tags: [Schedules]
     *     parameters:
     *       - in: path
     *         name: routeId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la ruta
     *         example: 1
     *     responses:
     *       200:
     *         description: Horarios de la ruta obtenidos exitosamente
     *       400:
     *         description: ID de ruta inválido
     *       500:
     *         description: Error interno del servidor
     */
    async findSchedulesByRouteId(req: Request, res: Response): Promise<Response> {
        try {
            const { routeId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+routeId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const schedules = await this.scheduleService.findSchedulesByRouteId(+routeId);
            return ApiResponse.success(res, schedules, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
