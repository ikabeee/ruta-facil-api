"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const authController = new auth_controller_1.AuthController();
// User registration
router.post('/register', auth_validation_1.validateRegister, (req, res) => authController.register(req, res));
// Email verification
router.get('/verify-email/:token', (req, res) => authController.verifyEmail(req, res));
// Login - Step 1: Send OTP
router.post('/login', auth_validation_1.validateLogin, (req, res) => authController.login(req, res));
// Login - Step 2: Verify OTP
router.post('/verify-otp', auth_validation_1.validateVerifyOTP, (req, res) => authController.verifyOTP(req, res));
// Password reset request
router.post('/request-password-reset', (req, res) => authController.requestPasswordReset(req, res));
// Password reset
router.post('/reset-password', auth_validation_1.validateResetPassword, (req, res) => authController.resetPassword(req, res));
// Logout
router.post('/logout', (req, res) => authController.logout(req, res));
