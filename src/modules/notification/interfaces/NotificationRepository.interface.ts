import { Notification } from "../../../../generated/prisma";
import { CreateNotificationDto } from "../dto/create-notification.dto";
import { UpdateNotificationDto } from "../dto/update-notification.dto";

export interface NotificationRepositoryInterface {
    findAll(): Promise<Notification[]>;
    findById(id: number): Promise<Notification>;
    findByUserId(userId: number): Promise<Notification[]>;
    createNotification(notificationData: CreateNotificationDto): Promise<Notification>;
    updateNotification(id: number, notificationData: UpdateNotificationDto): Promise<Notification>;
    deleteNotification(id: number): Promise<void>;
    markAsRead(id: number): Promise<Notification>;
    markAllAsReadByUserId(userId: number): Promise<void>;
    getStats(): Promise<any>;
}
