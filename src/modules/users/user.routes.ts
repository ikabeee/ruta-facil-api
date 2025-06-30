import express, { Request, Response } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient()
const userRepository = new UserRepository(prisma)
const userService = new UserService(userRepository)
const userController = new UserController(userService);
const router = express.Router();

router.get('/', async (req: Request, res: Response) => { await userController.findAllUsers(req, res); });
router.get('/:id', async (req: Request, res: Response) => { await userController.findUserById(req, res); });
router.post('/create', async (req: Request, res: Response) => { await userController.createUser(req, res); });
router.put('/update/:id', async (req: Request, res: Response) => { await userController.updateUser(req, res); });
router.delete('/delete/:id', async (req: Request, res: Response) => { await userController.deleteUser(req, res); });

export default router;