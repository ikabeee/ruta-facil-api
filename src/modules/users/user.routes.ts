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
router.get('/', adminMiddleware, async (req: Request, res: Response) => { await userController.findAllUsers(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await userController.findUserById(req, res); });
router.post('/create', adminMiddleware, async (req: Request, res: Response) => { await userController.createUser(req, res); });
router.put('/update/:id', adminMiddleware, async (req: Request, res: Response) => { await userController.updateUser(req, res); });
router.delete('/delete/:id', adminMiddleware, async (req: Request, res: Response) => { await userController.deleteUser(req, res); });

export default router;