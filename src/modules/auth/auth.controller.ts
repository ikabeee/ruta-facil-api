import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest, ResetPasswordRequest, VerifyOTPRequest } from './auth.types';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async register(req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> {
        try {
            const { name, lastName, email, password, phone } = req.body;
            const result = await this.authService.register({
                name,
                lastName,
                email,
                password,
                phone
            });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente. Por favor verifica tu correo electrónico.',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error en el registro'
            });
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.params;
            await this.authService.verifyEmail(token);

            res.status(200).json({
                success: true,
                message: 'Correo electrónico verificado exitosamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error en la verificación'
            });
        }
    }

    async login(req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.authService.initiateLogin(email, password);

            res.status(200).json({
                success: true,
                message: 'Código OTP enviado a tu correo electrónico',
                data: { sessionId: result.sessionId }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Credenciales inválidas'
            });
        }
    }

    async verifyOTP(req: Request<{}, {}, VerifyOTPRequest>, res: Response): Promise<void> {
        try {
            const { sessionId, otp } = req.body;
            const result = await this.authService.verifyOTP(sessionId, otp);

            // Set cookie with user information
            res.cookie('user_session', {
                name: result.user.name,
                lastName: result.user.lastName,
                role: result.user.role,
                status: result.user.status
            }, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: {
                    token: result.token,
                    user: {
                        name: result.user.name,
                        lastName: result.user.lastName,
                        role: result.user.role,
                        status: result.user.status
                    }
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Código OTP inválido'
            });
        }
    }

    async requestPasswordReset(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            await this.authService.requestPasswordReset(email);

            res.status(200).json({
                success: true,
                message: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al solicitar restablecimiento'
            });
        }
    }

    async resetPassword(req: Request<{}, {}, ResetPasswordRequest>, res: Response): Promise<void> {
        try {
            const { token, newPassword } = req.body;
            await this.authService.resetPassword(token, newPassword);

            res.status(200).json({
                success: true,
                message: 'Contraseña restablecida exitosamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al restablecer contraseña'
            });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('user_session');
            res.status(200).json({
                success: true,
                message: 'Sesión cerrada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al cerrar sesión'
            });
        }
    }
}