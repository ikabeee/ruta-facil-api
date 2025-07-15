import { Request, Response } from "express";
import { NotificationServiceInterface } from "./interfaces/NotificationService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { validate } from "class-validator";
import { UpdateNotificationDto } from "./dto/update-notification.dto";

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gestión de notificaciones del sistema
 */

export class NotificationController {
    constructor(private readonly notificationService: NotificationServiceInterface) { }

    /**
     * @swagger
     * /notifications:
     *   get:
     *     summary: Obtener todas las notificaciones
     *     description: Obtiene una lista de todas las notificaciones del sistema
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de notificaciones obtenida exitosamente
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
     *                         $ref: '#/components/schemas/Notification'
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async findAllNotifications(_req: Request, res: Response): Promise<Response> {
        try {
            const notifications = await this.notificationService.findAllNotifications();
            return ApiResponse.success(res, notifications, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /notifications/{id}:
     *   get:
     *     summary: Obtener una notificación por ID
     *     description: Obtiene los detalles de una notificación específica por su ID
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la notificación
     *     responses:
     *       200:
     *         description: Notificación encontrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Notification'
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Notificación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async findNotificationById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const notification = await this.notificationService.findNotificationById(+id);
            return ApiResponse.success(res, notification, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /notifications/user/{userId}:
     *   get:
     *     summary: Obtener notificaciones por ID de usuario
     *     description: Obtiene todas las notificaciones de un usuario específico
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID del usuario
     *     responses:
     *       200:
     *         description: Notificaciones encontradas exitosamente
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
     *                         $ref: '#/components/schemas/Notification'
     *       400:
     *         description: ID de usuario inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Usuario no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async findNotificationsByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+userId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const notifications = await this.notificationService.findNotificationsByUserId(+userId);
            return ApiResponse.success(res, notifications, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /notifications:
     *   post:
     *     summary: Crear una nueva notificación
     *     description: Crea una nueva notificación en el sistema
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateNotificationDto'
     *     responses:
     *       201:
     *         description: Notificación creada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Notification'
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async createNotification(req: Request, res: Response): Promise<Response> {
        try {
            const notificationData = plainToInstance(CreateNotificationDto, req.body);
            const errors = await validate(notificationData);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints || {}))
                    .flat();
                return ApiResponse.error(res, errorMessages, 400);
            }
            const newNotification = await this.notificationService.createNotification(notificationData);
            return ApiResponse.success(res, newNotification, 201);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /notifications/{id}:
     *   put:
     *     summary: Actualizar una notificación
     *     description: Actualiza la información de una notificación existente
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la notificación a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateNotificationDto'
     *     responses:
     *       200:
     *         description: Notificación actualizada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Notification'
     *       400:
     *         description: Datos de entrada inválidos o ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Notificación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async updateNotification(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const notificationData = plainToInstance(UpdateNotificationDto, req.body);
            const errors = await validate(notificationData);
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
            const updatedNotification = await this.notificationService.updateNotification(+id, notificationData);
            return ApiResponse.success(res, updatedNotification, 200);

        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /notifications/{id}:
     *   delete:
     *     summary: Eliminar una notificación
     *     description: Elimina una notificación existente por su ID
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la notificación a eliminar
     *     responses:
     *       200:
     *         description: Notificación eliminada exitosamente
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
     *                           example: "Notificación eliminada correctamente"
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Notificación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async deleteNotification(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.notificationService.deleteNotification(+id);
            return ApiResponse.success(res, { message: "Notificación eliminada correctamente" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /notifications/{id}/read:
     *   put:
     *     summary: Marcar notificación como leída
     *     description: Marca una notificación específica como leída
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID de la notificación a marcar como leída
     *     responses:
     *       200:
     *         description: Notificación marcada como leída exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Notification'
     *       400:
     *         description: ID inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Notificación no encontrada
     *       500:
     *         description: Error interno del servidor
     */
    async markAsRead(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+id);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            const notification = await this.notificationService.markAsRead(+id);
            return ApiResponse.success(res, notification, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /notifications/user/{userId}/mark-all-read:
     *   put:
     *     summary: Marcar todas las notificaciones de un usuario como leídas
     *     description: Marca todas las notificaciones de un usuario específico como leídas
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: ID del usuario
     *     responses:
     *       200:
     *         description: Todas las notificaciones marcadas como leídas exitosamente
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
     *                           example: "Todas las notificaciones han sido marcadas como leídas"
     *       400:
     *         description: ID de usuario inválido
     *       401:
     *         description: No autorizado
     *       404:
     *         description: Usuario no encontrado
     *       500:
     *         description: Error interno del servidor
     */
    async markAllAsReadByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const validationError = ValidateParams.validatePositiveInteger(+userId);
            if (validationError) {
                return ApiResponse.error(res, validationError, 400);
            }
            await this.notificationService.markAllAsReadByUserId(+userId);
            return ApiResponse.success(res, { message: "Todas las notificaciones han sido marcadas como leídas" }, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }

    /**
     * @swagger
     * /notifications/stats:
     *   get:
     *     summary: Obtener estadísticas de notificaciones
     *     description: Obtiene estadísticas generales del sistema de notificaciones
     *     tags: [Notifications]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Estadísticas obtenidas exitosamente
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
     *                         totalNotifications:
     *                           type: integer
     *                           description: Total de notificaciones
     *                         unreadNotifications:
     *                           type: integer
     *                           description: Notificaciones no leídas
     *                         readNotifications:
     *                           type: integer
     *                           description: Notificaciones leídas
     *                         recentNotifications:
     *                           type: integer
     *                           description: Notificaciones recientes (últimos 30 días)
     *                         readPercentage:
     *                           type: integer
     *                           description: Porcentaje de notificaciones leídas
     *                         lastUpdated:
     *                           type: string
     *                           format: date-time
     *                           description: Fecha de última actualización
     *       401:
     *         description: No autorizado
     *       500:
     *         description: Error interno del servidor
     */
    async getStats(req: Request, res: Response): Promise<Response> {
        try {
            const stats = await this.notificationService.getStats();
            return ApiResponse.success(res, stats, 200);
        } catch (error: any) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, error.message, 500);
        }
    }
}
