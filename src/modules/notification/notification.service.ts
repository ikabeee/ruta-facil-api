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

    async getStats(): Promise<{
        total: number;
        read: number;
        unread: number;
        recentNotifications: number; // Last 24 hours
        byTimeRange: {
            today: number;
            thisWeek: number;
            thisMonth: number;
        };
        topRecipients: Array<{
            userId: number;
            userName: string;
            notificationCount: number;
            unreadCount: number;
        }>;
        readRate: number; // Percentage of read notifications
    }> {
        return this.notificationRepository.getStats();
    }
}
