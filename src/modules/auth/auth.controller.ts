import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto, ResendVerificationDto } from './dto/auth.dto';
import { ApiResponse } from '../../shared/helpers/ApiResponse';
import { ApiError } from '../../shared/errors/ApiError';
import { CookieHelper } from '../../shared/helpers/CookieHelper';
import { UserSession } from './interfaces/Auth.interface';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * Iniciar sesión
     */
    public async login(req: Request, res: Response): Promise<Response > {
        try {
            // Validar datos de entrada
            const loginDto = plainToClass(LoginDto, req.body);
            const errors = await validate(loginDto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join(', ');
                return ApiResponse.error(res, errorMessages, 400);
            }

            // Autenticar usuario
            const authResponse = await this.authService.login(loginDto);

            // Configurar cookies
            const userSession: UserSession = {
                id: authResponse.user.id,
                email: authResponse.user.email,
                role: authResponse.user.role,
                name: authResponse.user.name
            };

            CookieHelper.setAuthCookie(res, authResponse.token, userSession);

            // Responder con datos del usuario (sin el token por seguridad)
            return ApiResponse.success(res, {
                user: authResponse.user,
                expiresIn: authResponse.expiresIn,
                message: 'Inicio de sesión exitoso'
            });

        } catch (error) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Registrar usuario
     */
    public async register(req: Request, res: Response): Promise<Response> {
        try {
            // Validar datos de entrada
            const registerDto = plainToClass(RegisterDto, req.body);
            const errors = await validate(registerDto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join(', ');
                return ApiResponse.error(res, errorMessages, 400);
            }

            // Registrar usuario
            const authResponse = await this.authService.register(registerDto);

            // Configurar cookies
            const userSession: UserSession = {
                id: authResponse.user.id,
                email: authResponse.user.email,
                role: authResponse.user.role,
                name: authResponse.user.name
            };

            CookieHelper.setAuthCookie(res, authResponse.token, userSession);

            // Responder con datos del usuario
            return ApiResponse.success(res, {
                user: authResponse.user,
                expiresIn: authResponse.expiresIn,
                message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
            }, 201);

        } catch (error) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Solicitar recuperación de contraseña
     */
    public async forgotPassword(req: Request, res: Response): Promise<Response> {
        try {
            // Validar datos de entrada
            const forgotPasswordDto = plainToClass(ForgotPasswordDto, req.body);
            const errors = await validate(forgotPasswordDto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join(', ');
                return ApiResponse.error(res, errorMessages, 400);
            }

            // Procesar solicitud
            await this.authService.forgotPassword(forgotPasswordDto);

            return ApiResponse.success(res, {
                message: 'Si el correo existe, se enviará un enlace de recuperación'
            });

        } catch (error) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Restablecer contraseña
     */
    public async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
            // Validar datos de entrada
            const resetPasswordDto = plainToClass(ResetPasswordDto, req.body);
            const errors = await validate(resetPasswordDto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join(', ');
                return ApiResponse.error(res, errorMessages, 400);
            }

            // Restablecer contraseña
            await this.authService.resetPassword(resetPasswordDto);

            return ApiResponse.success(res, {
                message: 'Contraseña restablecida exitosamente'
            });

        } catch (error) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Cambiar contraseña
     */
    public async changePassword(req: Request, res: Response): Promise<Response> {
        try {
            // Validar datos de entrada
            const changePasswordDto = plainToClass(ChangePasswordDto, req.body);
            const errors = await validate(changePasswordDto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join(', ');
                return ApiResponse.error(res, errorMessages, 400);
            }

            // Cambiar contraseña
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'Usuario no autenticado', 401);
            }

            await this.authService.changePassword(userId, changePasswordDto);

            return ApiResponse.success(res, {
                message: 'Contraseña cambiada exitosamente'
            });

        } catch (error) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Verificar correo electrónico
     */
    public async verifyEmail(req: Request, res: Response): Promise<Response> {
        try {
            // Validar datos de entrada
            const verifyEmailDto = plainToClass(VerifyEmailDto, req.body);
            const errors = await validate(verifyEmailDto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join(', ');
                return ApiResponse.error(res, errorMessages, 400);
            }

            // Verificar email
            await this.authService.verifyEmail(verifyEmailDto);

            return ApiResponse.success(res, {
                message: 'Correo electrónico verificado exitosamente'
            });

        } catch (error) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Reenviar verificación de correo
     */
    public async resendVerification(req: Request, res: Response): Promise<Response> {
        try {
            // Validar datos de entrada
            const resendVerificationDto = plainToClass(ResendVerificationDto, req.body);
            const errors = await validate(resendVerificationDto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => 
                    Object.values(error.constraints || {}).join(', ')
                ).join(', ');
                return ApiResponse.error(res, errorMessages, 400);
            }

            // Reenviar verificación
            await this.authService.resendVerification(resendVerificationDto);

            return ApiResponse.success(res, {
                message: 'Correo de verificación enviado'
            });

        } catch (error) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Obtener usuario actual
     */
    public async getCurrentUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'Usuario no autenticado', 401);
            }

            const user = await this.authService.getCurrentUser(userId);

            return ApiResponse.success(res, {
                user: {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName || undefined,
                    email: user.email,
                    role: user.role,
                    emailVerified: user.emailVerified,
                    phone: user.phone,
                    status: user.status,
                    createdAt: user.createdAt
                }
            });

        } catch (error) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Refrescar token
     */
    public async refreshToken(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'Usuario no autenticado', 401);
            }

            const authResponse = await this.authService.refreshToken(userId);

            // Actualizar cookies
            const userSession: UserSession = {
                id: authResponse.user.id,
                email: authResponse.user.email,
                role: authResponse.user.role,
                name: authResponse.user.name
            };

            CookieHelper.setAuthCookie(res, authResponse.token, userSession);

            return ApiResponse.success(res, {
                user: authResponse.user,
                expiresIn: authResponse.expiresIn,
                message: 'Token actualizado exitosamente'
            });

        } catch (error) {
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Cerrar sesión
     */
    public async logout(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            
            // Llamar al servicio de logout con el objeto Response
            // para que pueda limpiar cookies desde el servicio
            if (userId) {
                await this.authService.logout(userId, res);
            } else {
                // Si no hay usuario autenticado, limpiar cookies de todas formas
                CookieHelper.clearAuthCookies(res);
            }

            return ApiResponse.success(res, {
                message: 'Sesión cerrada exitosamente'
            });

        } catch (error) {
            // En caso de error, limpiar cookies de todas formas
            CookieHelper.clearAuthCookies(res);
            
            if (error instanceof ApiError) {
                return ApiResponse.error(res, error.message, error.statusCode);
            }
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }
    }

    /**
     * Verificar estado de autenticación
     */
    public async checkAuth(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'Usuario no autenticado', 401);
            }

            const user = await this.authService.getCurrentUser(userId);

            return ApiResponse.success(res, {
                authenticated: true,
                user: {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName || undefined,
                    email: user.email,
                    role: user.role,
                    emailVerified: user.emailVerified
                }
            });

        } catch (error) {
            return ApiResponse.error(res, 'Usuario no autenticado', 401);
        }
    }
}