import { Request, Response } from "express";
import { NotificationServiceInterface } from "./interfaces/NotificationService.interface";
import { ApiResponse } from "../../shared/helpers/ApiResponse";
import { ApiError } from "../../shared/errors/ApiError";
import { ValidateParams } from "../../shared/helpers/ValidateParams";
import { plainToInstance } from "class-transformer";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { validate } from "class-validator";
import { UpdateNotificationDto } from "./dto/update-notification.dto";

export class NotificationController {
    constructor(private readonly notificationService: NotificationServiceInterface) { }

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
}
