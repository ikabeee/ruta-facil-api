import express, { Request, Response } from 'express';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();
const notificationRepository = new NotificationRepository(prisma);
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);
const router = express.Router();

// Rutas principales
router.get('/', async (req: Request, res: Response) => { await notificationController.findAllNotifications(req, res); });
router.get('/stats', async (req: Request, res: Response) => { await notificationController.getStats(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await notificationController.findNotificationById(req, res); });
router.post('/create', async (req: Request, res: Response) => { await notificationController.createNotification(req, res); });
router.put('/update/:id', async (req: Request, res: Response) => { await notificationController.updateNotification(req, res); });
router.delete('/delete/:id', async (req: Request, res: Response) => { await notificationController.deleteNotification(req, res); });

// Rutas específicas para notificaciones
router.get('/user/:userId', async (req: Request, res: Response) => { await notificationController.findNotificationsByUserId(req, res); });
router.patch('/mark-read/:id', async (req: Request, res: Response) => { await notificationController.markAsRead(req, res); });
router.patch('/mark-all-read/:userId', async (req: Request, res: Response) => { await notificationController.markAllAsReadByUserId(req, res); });

export default router;