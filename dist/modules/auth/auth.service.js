"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const prisma_1 = require("../../shared/database/prisma");
const email_service_1 = require("../../shared/services/email.service");
const otp_service_1 = require("../../shared/services/otp.service");
class AuthService {
    constructor() {
        this.loginSessions = new Map();
        this.prisma = new prisma_1.PrismaClient();
        this.emailService = new email_service_1.EmailService();
        this.otpService = new otp_service_1.OTPService();
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user already exists
            const existingUser = yield this.prisma.user.findUnique({
                where: { email: userData.email }
            });
            if (existingUser) {
                throw new Error('El usuario ya existe con este correo electrónico');
            }
            // Hash password
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 12);
            // Create verification token
            const verificationToken = (0, uuid_1.v4)();
            // Create user
            const user = yield this.prisma.user.create({
                data: {
                    name: userData.name,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: hashedPassword,
                    phone: userData.phone,
                    status: 'PENDING'
                }
            });
            // Send verification email
            yield this.emailService.sendVerificationEmail(userData.email, verificationToken);
            return {
                userId: user.id,
                verificationToken
            };
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // In a real implementation, you would store verification tokens in the database
            // For now, we'll simulate the verification process
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default-secret');
            if (!decoded.email) {
                throw new Error('Token de verificación inválido');
            }
            // Update user status to ACTIVE
            const user = yield this.prisma.user.findUnique({
                where: { email: decoded.email }
            });
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            yield this.prisma.user.update({
                where: { id: user.id },
                data: {
                    status: 'ACTIVE',
                    emailVerified: true
                }
            });
        });
    }
    initiateLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify user credentials
            const user = yield this.prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                throw new Error('Credenciales inválidas');
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Credenciales inválidas');
            }
            if (user.status !== 'ACTIVE') {
                throw new Error('Usuario no activo. Por favor verifica tu correo electrónico.');
            }
            // Generate OTP
            const otp = this.otpService.generateOTP();
            const sessionId = (0, uuid_1.v4)();
            // Store login session
            this.loginSessions.set(sessionId, {
                userId: user.id,
                email: user.email,
                otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
            });
            // Send OTP via email
            yield this.emailService.sendOTPEmail(email, otp);
            return { sessionId };
        });
    }
    verifyOTP(sessionId, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = this.loginSessions.get(sessionId);
            if (!session) {
                throw new Error('Sesión inválida o expirada');
            }
            if (session.expiresAt < new Date()) {
                this.loginSessions.delete(sessionId);
                throw new Error('Código OTP expirado');
            }
            if (session.otp !== otp) {
                throw new Error('Código OTP inválido');
            }
            // Get user details
            const user = yield this.prisma.user.findUnique({
                where: { id: session.userId }
            });
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({
                userId: user.id,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });
            // Clean up session
            this.loginSessions.delete(sessionId);
            return {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName || undefined,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            };
        });
    }
    requestPasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                // Don't reveal if user exists for security
                return;
            }
            // Generate reset token
            const resetToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '1h' });
            // Send reset email
            yield this.emailService.sendPasswordResetEmail(email, resetToken);
        });
    }
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default-secret');
                const user = yield this.prisma.user.findUnique({
                    where: { id: decoded.userId }
                });
                if (!user) {
                    throw new Error('Usuario no encontrado');
                }
                // Hash new password
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
                // Update password
                yield this.prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashedPassword }
                });
            }
            catch (error) {
                throw new Error('Token de restablecimiento inválido o expirado');
            }
        });
    }
}
exports.AuthService = AuthService;
