import express from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient()
const userRepository = new UserRepository(prisma)
const userService = new UserService(userRepository)
const userController = new UserController(userService);
const router = express.Router();

router.get('/', userController.findAllUsers())

export default router;