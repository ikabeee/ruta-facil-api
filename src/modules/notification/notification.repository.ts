import { PrismaClient, Notification } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationRepositoryInterface } from "./interfaces/NotificationRepository.interface";

export class NotificationRepository implements NotificationRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<Notification[]> {
        const notifications = await this.prisma.notification.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return notifications;
    }

    async findById(id: number): Promise<Notification> {
        try {
            const notification = await this.prisma.notification.findUnique({
                where: { id }
            });
            if (!notification) {
                throw new ApiError(404, `Notificación con id ${id} no encontrada.`);
            }
            return notification;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar la notificación con id ${id}`);
        }
    }

    async findByUserId(userId: number): Promise<Notification[]> {
        try {
            const notifications = await this.prisma.notification.findMany({
                where: { userId },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return notifications;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar las notificaciones del usuario con id ${userId}`);
        }
    }

    async createNotification(notificationData: CreateNotificationDto): Promise<Notification> {
        try {
            const notification = await this.prisma.notification.create({
                data: {
                    ...notificationData
                }
            });
            return notification;
        } catch (error: any) {
            throw new ApiError(500, `Error al crear la notificación: ${error.message}`);
        }
    }

    async updateNotification(id: number, notificationData: UpdateNotificationDto): Promise<Notification> {
        try {
            const notification = await this.prisma.notification.findUnique({
                where: { id }
            });
            if (!notification) {
                throw new ApiError(404, `Notificación con id ${id} no encontrada.`);
            }
            const notificationUpdated = await this.prisma.notification.update({
                where: { id },
                data: {
                    ...notificationData,
                    updatedAt: new Date()
                }
            });
            return notificationUpdated;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar la notificación con id ${id}`);
        }
    }

    async deleteNotification(id: number): Promise<void> {
        try {
            const notification = await this.prisma.notification.findUnique({
                where: { id }
            });
            if (!notification) {
                throw new ApiError(404, `Notificación con id ${id} no encontrada.`);
            }
            await this.prisma.notification.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar la notificación con id ${id}`);
        }
    }

    async markAsRead(id: number): Promise<Notification> {
        try {
            const notification = await this.prisma.notification.findUnique({
                where: { id }
            });
            if (!notification) {
                throw new ApiError(404, `Notificación con id ${id} no encontrada.`);
            }
            const notificationUpdated = await this.prisma.notification.update({
                where: { id },
                data: {
                    isRead: true,
                    updatedAt: new Date()
                }
            });
            return notificationUpdated;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al marcar como leída la notificación con id ${id}`);
        }
    }

    async markAllAsReadByUserId(userId: number): Promise<void> {
        try {
            await this.prisma.notification.updateMany({
                where: { 
                    userId,
                    isRead: false
                },
                data: {
                    isRead: true,
                    updatedAt: new Date()
                }
            });
        } catch (error: any) {
            throw new ApiError(500, `Error al marcar todas las notificaciones como leídas para el usuario con id ${userId}`);
        }
    }
}
