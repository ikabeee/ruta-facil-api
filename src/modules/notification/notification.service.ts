import { Notification } from "../../../generated/prisma";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationRepositoryInterface } from "./interfaces/NotificationRepository.interface";
import { NotificationServiceInterface } from "./interfaces/NotificationService.interface";

export class NotificationService implements NotificationServiceInterface {
    constructor(
        private readonly notificationRepository: NotificationRepositoryInterface
    ) { }

    async findAllNotifications(): Promise<Notification[]> {
        return this.notificationRepository.findAll();
    }

    async findNotificationById(id: number): Promise<Notification> {
        return this.notificationRepository.findById(id);
    }

    async findNotificationsByUserId(userId: number): Promise<Notification[]> {
        return this.notificationRepository.findByUserId(userId);
    }

    async createNotification(notificationData: CreateNotificationDto): Promise<Notification> {
        return this.notificationRepository.createNotification(notificationData);
    }

    async updateNotification(id: number, notificationData: UpdateNotificationDto): Promise<Notification> {
        return this.notificationRepository.updateNotification(id, notificationData);
    }

    async deleteNotification(id: number): Promise<void> {
        return this.notificationRepository.deleteNotification(id);
    }

    async markAsRead(id: number): Promise<Notification> {
        return this.notificationRepository.markAsRead(id);
    }

    async markAllAsReadByUserId(userId: number): Promise<void> {
        return this.notificationRepository.markAllAsReadByUserId(userId);
    }
}
