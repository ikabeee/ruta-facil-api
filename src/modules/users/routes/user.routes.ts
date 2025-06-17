import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// Get all users
router.get('/', (req, res) => userController.getAllUsers(req, res));

// Get user by id
router.get('/:id', (req, res) => userController.getOneUser(req, res));

// Create new user
router.post('/', (req, res) => userController.createUser(req, res));

// Update user
router.put('/:id', (req, res) => userController.updateUser(req, res));

// Verify user
router.patch('/:id/verify', (req, res) => userController.verifyUser(req, res));

export default router;