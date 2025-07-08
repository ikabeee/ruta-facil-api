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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación y gestión de usuarios
 */

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Iniciar sesión
     *     description: Autentica a un usuario y devuelve un token de acceso
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Correo electrónico del usuario
     *                 example: usuario@ejemplo.com
     *               password:
     *                 type: string
     *                 format: password
     *                 description: Contraseña del usuario
     *                 example: miPassword123
     *     responses:
     *       200:
     *         description: Inicio de sesión exitoso
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         user:
     *                           $ref: '#/components/schemas/User'
     *                         expiresIn:
     *                           type: string
     *                           description: Tiempo de expiración del token
     *                         message:
     *                           type: string
     *                           example: "Inicio de sesión exitoso"
     *       400:
     *         description: Datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Credenciales inválidas
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    public async login(req: Request, res: Response): Promise<Response> {
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
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Registrar nuevo usuario
     *     description: Crea una nueva cuenta de usuario
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *               - role
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nombre del usuario
     *                 example: Juan Pérez
     *               lastName:
     *                 type: string
     *                 description: Apellido del usuario
     *                 example: García
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Correo electrónico único
     *                 example: juan.perez@ejemplo.com
     *               password:
     *                 type: string
     *                 format: password
     *                 description: Contraseña (mínimo 6 caracteres)
     *                 example: miPassword123
     *               phone:
     *                 type: string
     *                 description: Número de teléfono
     *                 example: "+1234567890"
     *               role:
     *                 type: string
     *                 enum: [USER, DRIVER, OWNER]
     *                 description: Rol del usuario
     *                 example: USER
     *     responses:
     *       201:
     *         description: Usuario registrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         user:
     *                           $ref: '#/components/schemas/User'
     *                         expiresIn:
     *                           type: string
     *                         message:
     *                           type: string
     *                           example: "Registro exitoso. Revisa tu correo para verificar tu cuenta."
     *       400:
     *         description: Datos de entrada inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       409:
     *         description: El email ya está en uso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /auth/forgot-password:
     *   post:
     *     summary: Solicitar recuperación de contraseña
     *     description: Envía un email con enlace para restablecer la contraseña
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Correo electrónico del usuario
     *                 example: usuario@ejemplo.com
     *     responses:
     *       200:
     *         description: Solicitud procesada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         message:
     *                           type: string
     *                           example: "Si el correo existe, se enviará un enlace de recuperación"
     *       400:
     *         description: Email inválido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /auth/reset-password:
     *   post:
     *     summary: Restablecer contraseña
     *     description: Restablece la contraseña usando el token de recuperación
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - token
     *               - password
     *             properties:
     *               token:
     *                 type: string
     *                 description: Token de recuperación recibido por email
     *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *               password:
     *                 type: string
     *                 format: password
     *                 description: Nueva contraseña
     *                 example: "nuevaPassword123"
     *     responses:
     *       200:
     *         description: Contraseña restablecida exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         message:
     *                           type: string
     *                           example: "Contraseña restablecida exitosamente"
     *       400:
     *         description: Token inválido o expirado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /auth/change-password:
     *   post:
     *     summary: Cambiar contraseña
     *     description: Cambia la contraseña del usuario autenticado
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - currentPassword
     *               - newPassword
     *             properties:
     *               currentPassword:
     *                 type: string
     *                 format: password
     *                 description: Contraseña actual
     *                 example: "passwordActual123"
     *               newPassword:
     *                 type: string
     *                 format: password
     *                 description: Nueva contraseña
     *                 example: "nuevaPassword123"
     *     responses:
     *       200:
     *         description: Contraseña cambiada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         message:
     *                           type: string
     *                           example: "Contraseña cambiada exitosamente"
     *       400:
     *         description: Contraseña actual incorrecta
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /auth/verify-email:
     *   post:
     *     summary: Verificar correo electrónico
     *     description: Verifica el correo electrónico usando el token enviado
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - token
     *             properties:
     *               token:
     *                 type: string
     *                 description: Token de verificación recibido por email
     *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *     responses:
     *       200:
     *         description: Correo verificado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         message:
     *                           type: string
     *                           example: "Correo electrónico verificado exitosamente"
     *       400:
     *         description: Token inválido o expirado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /auth/resend-verification:
     *   post:
     *     summary: Reenviar verificación de correo
     *     description: Reenvía el email de verificación
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Correo electrónico del usuario
     *                 example: usuario@ejemplo.com
     *     responses:
     *       200:
     *         description: Correo de verificación enviado
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         message:
     *                           type: string
     *                           example: "Correo de verificación enviado"
     *       400:
     *         description: Email inválido
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /auth/me:
     *   get:
     *     summary: Obtener usuario actual
     *     description: Obtiene la información del usuario autenticado
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Información del usuario obtenida exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         user:
     *                           $ref: '#/components/schemas/User'
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /auth/refresh-token:
     *   post:
     *     summary: Refrescar token de acceso
     *     description: Genera un nuevo token de acceso para el usuario autenticado
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Token actualizado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         user:
     *                           $ref: '#/components/schemas/User'
     *                         expiresIn:
     *                           type: string
     *                           description: Tiempo de expiración del nuevo token
     *                         message:
     *                           type: string
     *                           example: "Token actualizado exitosamente"
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Cerrar sesión
     *     description: Cierra la sesión del usuario y limpia las cookies de autenticación
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Sesión cerrada exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         message:
     *                           type: string
     *                           example: "Sesión cerrada exitosamente"
     *       500:
     *         description: Error interno del servidor
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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
     * @swagger
     * /auth/check:
     *   get:
     *     summary: Verificar estado de autenticación
     *     description: Verifica si el usuario está autenticado y devuelve información básica
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *       - cookieAuth: []
     *     responses:
     *       200:
     *         description: Usuario autenticado
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/ApiResponse'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         authenticated:
     *                           type: boolean
     *                           example: true
     *                         user:
     *                           type: object
     *                           properties:
     *                             id:
     *                               type: integer
     *                             name:
     *                               type: string
     *                             lastName:
     *                               type: string
     *                             email:
     *                               type: string
     *                             role:
     *                               type: string
     *                             emailVerified:
     *                               type: boolean
     *       401:
     *         description: Usuario no autenticado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
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