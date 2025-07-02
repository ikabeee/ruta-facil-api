import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '../../shared/database/prisma';
import { EmailService } from '../../shared/services/email.service';
import { OTPService } from '../../shared/services/otp.service';
import { RegisterRequest, AuthResponse, LoginSession } from './auth.types';

export class AuthService {
    private prisma: PrismaClient;
    private emailService: EmailService;
    private otpService: OTPService;
    private loginSessions: Map<string, LoginSession> = new Map();

    constructor() {
        this.prisma = new PrismaClient();
        this.emailService = new EmailService();
        this.otpService = new OTPService();
    }

    async register(userData: RegisterRequest): Promise<{ userId: number; verificationToken: string }> {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new Error('El usuario ya existe con este correo electrónico');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create verification token
        const verificationToken = uuidv4();

        // Create user
        const user = await this.prisma.user.create({
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
        await this.emailService.sendVerificationEmail(userData.email, verificationToken);

        return {
            userId: user.id,
            verificationToken
        };
    }

    async verifyEmail(token: string): Promise<void> {
        // In a real implementation, you would store verification tokens in the database
        // For now, we'll simulate the verification process
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
        
        if (!decoded.email) {
            throw new Error('Token de verificación inválido');
        }

        // Update user status to ACTIVE
        const user = await this.prisma.user.findUnique({
            where: { email: decoded.email }
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                status: 'ACTIVE',
                emailVerified: true
            }
        });
    }

    async initiateLogin(email: string, password: string): Promise<{ sessionId: string }> {
        // Verify user credentials
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }

        if (user.status !== 'ACTIVE') {
            throw new Error('Usuario no activo. Por favor verifica tu correo electrónico.');
        }

        // Generate OTP
        const otp = this.otpService.generateOTP();
        const sessionId = uuidv4();

        // Store login session
        this.loginSessions.set(sessionId, {
            userId: user.id,
            email: user.email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        });

        // Send OTP via email
        await this.emailService.sendOTPEmail(email, otp);

        return { sessionId };
    }

    async verifyOTP(sessionId: string, otp: string): Promise<AuthResponse> {
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
        const user = await this.prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: '24h' }
        );

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
    }

    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Don't reveal if user exists for security
            return;
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: '1h' }
        );

        // Send reset email
        await this.emailService.sendPasswordResetEmail(email, resetToken);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;

            const user = await this.prisma.user.findUnique({
                where: { id: decoded.userId }
            });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 12);

            // Update password
            await this.prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });

        } catch (error) {
            throw new Error('Token de restablecimiento inválido o expirado');
        }
    }
}