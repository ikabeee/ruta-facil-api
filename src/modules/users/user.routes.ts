import express, { Request, Response } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { authMiddleware, adminMiddleware } from '../../shared/middleware/auth.middleware';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient()
const userRepository = new UserRepository(prisma)
const userService = new UserService(userRepository)
const userController = new UserController(userService);
const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Las rutas de administración de usuarios requieren permisos de admin
router.get('/stats', adminMiddleware, async (req: Request, res: Response) => { await userController.getStats(req, res); });
router.get('/available-drivers', adminMiddleware, async (req: Request, res: Response) => { await userController.getAvailableDriverUsers(req, res); });
router.get('/role/:role', adminMiddleware, async (req: Request, res: Response) => { await userController.getUsersByRole(req, res); });
router.get('/drivers', adminMiddleware, async (req: Request, res: Response) => { await userController.getDriverUsers(req, res); });
router.get('/owners', adminMiddleware, async (req: Request, res: Response) => { await userController.getOwnerUsers(req, res); });
router.get('/', adminMiddleware, async (req: Request, res: Response) => { await userController.findAllUsers(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await userController.findUserById(req, res); });
router.post('/create', adminMiddleware, async (req: Request, res: Response) => { await userController.createUser(req, res); });
router.put('/update/:id', adminMiddleware, async (req: Request, res: Response) => { await userController.updateUser(req, res); });
router.put('/:id/driver-profile', adminMiddleware, async (req: Request, res: Response) => { await userController.updateDriverProfile(req, res); });
router.put('/:id/owner-profile', adminMiddleware, async (req: Request, res: Response) => { await userController.updateOwnerProfile(req, res); });
router.delete('/delete/:id', adminMiddleware, async (req: Request, res: Response) => { await userController.deleteUser(req, res); });

export default router;