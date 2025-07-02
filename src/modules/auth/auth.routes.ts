import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRegister, validateLogin, validateVerifyOTP, validateResetPassword } from './auth.validation';

const router = Router();
const authController = new AuthController();

// User registration
router.post('/register', validateRegister, (req, res) => authController.register(req, res));

// Email verification
router.get('/verify-email/:token', (req, res) => authController.verifyEmail(req, res));

// Login - Step 1: Send OTP
router.post('/login', validateLogin, (req, res) => authController.login(req, res));

// Login - Step 2: Verify OTP
router.post('/verify-otp', validateVerifyOTP, (req, res) => authController.verifyOTP(req, res));

// Password reset request
router.post('/request-password-reset', (req, res) => authController.requestPasswordReset(req, res));

// Password reset
router.post('/reset-password', validateResetPassword, (req, res) => authController.resetPassword(req, res));

// Logout
router.post('/logout', (req, res) => authController.logout(req, res));

export { router as authRoutes };