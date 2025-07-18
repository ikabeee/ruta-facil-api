import { PrismaClient, User, UserRole, UserStatus } from "../../../generated/prisma";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto, ResendVerificationDto } from "./dto/auth.dto";
import { AuthServiceInterface } from "./interfaces/AuthService.interface";
import { AuthResponse, UserSession } from "./interfaces/Auth.interface";
import { ApiError } from "../../shared/errors/ApiError";
import { HashHelper } from "../../shared/helpers/HashHelper";
import { JwtHelper } from "../../shared/helpers/JwtHelper";
import { MailService } from "../../shared/services/mail.service";
import { CookieHelper } from "../../shared/helpers/CookieHelper";
import { UserService } from "../users/user.service";
import { UserRepository } from "../users/user.repository";
import { Response } from "express";

export class AuthService implements AuthServiceInterface {
    private prisma: PrismaClient;
    private mailService: MailService;
    private userService: UserService;
    private userRepository: UserRepository;

    constructor() {
        this.prisma = new PrismaClient();
        this.mailService = new MailService();
        this.userRepository = new UserRepository(this.prisma);
        this.userService = new UserService(this.userRepository);
    }

    /**
     * Autentica un usuario y genera tokens
     * @param data - Datos de login
     * @returns Promise<AuthResponse>
     */
    async login(data: LoginDto): Promise<AuthResponse> {
        try {
            // Validar usuario
            const user = await this.validateUser(data.email, data.password);
            if (!user) {
                throw new ApiError(401, 'Credenciales inválidas');
            }

            // Verificar si el usuario está activo
            if (user.status !== UserStatus.ACTIVE) {
                throw new ApiError(403, 'Usuario inactivo. Contacte al administrador');
            }

            // Generar tokens
            const tokenData = JwtHelper.generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            });

            return {
                user: {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName || undefined,
                    email: user.email,
                    role: user.role,
                    emailVerified: user.emailVerified
                },
                token: tokenData.token,
                expiresIn: tokenData.expiresIn
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Registra un nuevo usuario
     * @param data - Datos de registro
     * @returns Promise<AuthResponse>
     */
    async register(data: RegisterDto): Promise<AuthResponse> {
        try {
            // Validar que las contraseñas coincidan
            if (data.password !== data.confirmPassword) {
                throw new ApiError(400, 'Las contraseñas no coinciden');
            }

            // Verificar que el email no exista
            const existingUser = await this.getUserByEmail(data.email);
            if (existingUser) {
                throw new ApiError(409, 'El correo electrónico ya está registrado');
            }

            // Validar fortaleza de contraseña
            const passwordValidation = HashHelper.validatePasswordStrength(data.password);
            if (!passwordValidation.isValid) {
                throw new ApiError(400, passwordValidation.errors.join(', '));
            }

            // Crear usuario usando UserService (sin hashear aquí ya que UserRepository se encarga)
            const newUser = await this.userService.createUser({
                name: data.name,
                lastName: data.lastName || '',
                email: data.email,
                password: data.password, // UserRepository se encarga del hash
                phone: data.phone || '',
                role: data.role || UserRole.USER, // Por defecto USER
                status: UserStatus.PENDING, // Usuario pendiente hasta verificar email
                emailVerified: false, // Por defecto false
                createdAt: new Date() // Fecha actual
            });

            // Generar token de verificación de email
            const verificationToken = JwtHelper.generateEmailVerificationToken(newUser.email);

            // Enviar correo de verificación
            await this.mailService.sendEmailVerification(newUser.email, verificationToken);

            // Enviar correo de bienvenida
            await this.mailService.sendWelcomeEmail(newUser.email, newUser.name);

            // Generar tokens para login automático
            const tokenData = JwtHelper.generateToken({
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name
            });

            return {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    lastName: newUser.lastName || undefined,
                    email: newUser.email,
                    role: newUser.role,
                    emailVerified: newUser.emailVerified
                },
                token: tokenData.token,
                expiresIn: tokenData.expiresIn
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Inicia el proceso de recuperación de contraseña
     * @param data - Datos de recuperación
     * @returns Promise<void>
     */
    async forgotPassword(data: ForgotPasswordDto): Promise<void> {
        try {
            const user = await this.getUserByEmail(data.email);
            if (!user) {
                // Por seguridad, no revelamos si el email existe o no
                return;
            }

            // Generar token de reset
            const resetToken = JwtHelper.generatePasswordResetToken(user.email);

            // Enviar correo de reset
            await this.mailService.sendPasswordResetEmail(user.email, resetToken);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Restablece la contraseña usando un token
     * @param data - Datos de reset
     * @returns Promise<void>
     */
    async resetPassword(data: ResetPasswordDto): Promise<void> {
        try {
            // Validar que las contraseñas coincidan
            if (data.newPassword !== data.confirmPassword) {
                throw new ApiError(400, 'Las contraseñas no coinciden');
            }

            // Verificar token
            const email = JwtHelper.verifyTemporaryToken(data.token, 'password-reset');

            // Obtener usuario
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new ApiError(404, 'Usuario no encontrado');
            }

            // Validar fortaleza de contraseña
            const passwordValidation = HashHelper.validatePasswordStrength(data.newPassword);
            if (!passwordValidation.isValid) {
                throw new ApiError(400, passwordValidation.errors.join(', '));
            }

            // Hashear nueva contraseña
            const hashedPassword = await HashHelper.hashPassword(data.newPassword);

            // Actualizar contraseña
            await this.userService.updateUser(user.id, { 
                password: hashedPassword,
                updatedAt: new Date()
            });

            // Enviar confirmación por correo
            await this.mailService.sendNotificationEmail(
                user.email,
                'Contraseña Restablecida',
                'Tu contraseña ha sido restablecida exitosamente. Si no realizaste esta acción, contacta al soporte inmediatamente.'
            );
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Cambia la contraseña del usuario autenticado
     * @param userId - ID del usuario
     * @param data - Datos de cambio de contraseña
     * @returns Promise<void>
     */
    async changePassword(userId: number, data: ChangePasswordDto): Promise<void> {
        try {
            // Validar que las contraseñas coincidan
            if (data.newPassword !== data.confirmPassword) {
                throw new ApiError(400, 'Las contraseñas no coinciden');
            }

            // Obtener usuario
            const user = await this.getUserById(userId);
            if (!user) {
                throw new ApiError(404, 'Usuario no encontrado');
            }

            // Verificar contraseña actual
            const isValidPassword = await HashHelper.comparePassword(data.currentPassword, user.password);
            if (!isValidPassword) {
                throw new ApiError(400, 'Contraseña actual incorrecta');
            }

            // Validar que la nueva contraseña sea diferente
            const isSamePassword = await HashHelper.comparePassword(data.newPassword, user.password);
            if (isSamePassword) {
                throw new ApiError(400, 'La nueva contraseña debe ser diferente a la actual');
            }

            // Validar fortaleza de contraseña
            const passwordValidation = HashHelper.validatePasswordStrength(data.newPassword);
            if (!passwordValidation.isValid) {
                throw new ApiError(400, passwordValidation.errors.join(', '));
            }

            // Hashear nueva contraseña
            const hashedPassword = await HashHelper.hashPassword(data.newPassword);

            // Actualizar contraseña
            await this.userService.updateUser(userId, { 
                password: hashedPassword,
                updatedAt: new Date()
            });

            // Enviar confirmación por correo
            await this.mailService.sendNotificationEmail(
                user.email,
                'Contraseña Actualizada',
                'Tu contraseña ha sido actualizada exitosamente.'
            );
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Verifica el correo electrónico del usuario
     * @param data - Datos de verificación
     * @returns Promise<void>
     */
    async verifyEmail(data: VerifyEmailDto): Promise<void> {
        try {
            // Verificar token
            const email = JwtHelper.verifyTemporaryToken(data.token, 'email-verification');

            // Obtener usuario
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new ApiError(404, 'Usuario no encontrado');
            }

            // Verificar si ya está verificado
            if (user.emailVerified) {
                throw new ApiError(400, 'El correo electrónico ya está verificado');
            }

            // Actualizar usuario
            await this.updateUserStatus(user.id, true);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Reenvía el correo de verificación
     * @param data - Datos de reenvío
     * @returns Promise<void>
     */
    async resendVerification(data: ResendVerificationDto): Promise<void> {
        try {
            const user = await this.getUserByEmail(data.email);
            if (!user) {
                throw new ApiError(404, 'Usuario no encontrado');
            }

            if (user.emailVerified) {
                throw new ApiError(400, 'El correo electrónico ya está verificado');
            }

            // Generar nuevo token
            const verificationToken = JwtHelper.generateEmailVerificationToken(user.email);

            // Enviar correo
            await this.mailService.sendEmailVerification(user.email, verificationToken);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Obtiene el usuario actual
     * @param userId - ID del usuario
     * @returns Promise<User>
     */
    async getCurrentUser(userId: number): Promise<User> {
        try {
            const user = await this.getUserById(userId);
            if (!user) {
                throw new ApiError(404, 'Usuario no encontrado');
            }
            return user;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Refresca el token del usuario
     * @param userId - ID del usuario
     * @returns Promise<AuthResponse>
     */
    async refreshToken(userId: number): Promise<AuthResponse> {
        try {
            const user = await this.getUserById(userId);
            if (!user) {
                throw new ApiError(404, 'Usuario no encontrado');
            }

            const tokenData = JwtHelper.generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            });

            return {
                user: {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName || undefined,
                    email: user.email,
                    role: user.role,
                    emailVerified: user.emailVerified
                },
                token: tokenData.token,
                expiresIn: tokenData.expiresIn
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Cierra sesión del usuario
     * @param userId - ID del usuario
     * @param res - Response object para limpiar cookies
     * @returns Promise<void>
     */
    async logout(userId: number, res?: Response): Promise<void> {
        try {
            // Validar que el usuario existe
            const user = await this.getUserById(userId);
            if (!user) {
                throw new ApiError(404, 'Usuario no encontrado');
            }

            // Limpiar cookies si se proporciona el objeto Response
            if (res) {
                CookieHelper.clearAuthCookies(res);
                CookieHelper.clearRememberMeCookies(res);
            }

            // Aquí podrías agregar lógica adicional como:
            // - Invalidar tokens en una blacklist
            // - Registrar el evento de logout en logs de auditoría
            // - Actualizar última actividad del usuario
            // - Notificar otros dispositivos conectados (si implementas sesiones múltiples)

            // Opcional: Actualizar timestamp de último logout
            await this.userService.updateUser(userId, { 
                updatedAt: new Date() 
            });

            // Enviar notificación de cierre de sesión si es necesario
            // await this.mailService.sendNotificationEmail(
            //     user.email,
            //     'Sesión Cerrada',
            //     'Tu sesión ha sido cerrada exitosamente.'
            // );

        } catch (error) {
            // Si hay error pero se proporciona response, limpiar cookies de todas formas
            if (res) {
                CookieHelper.clearAuthCookies(res);
                CookieHelper.clearRememberMeCookies(res);
            }

            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno al cerrar sesión');
        }
    }

    /**
     * Valida un usuario por email y contraseña
     * @param email - Email del usuario
     * @param password - Contraseña del usuario
     * @returns Promise<User | null>
     */
    async validateUser(email: string, password: string): Promise<User | null> {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                return null;
            }

            const isValidPassword = await HashHelper.comparePassword(password, user.password);
            if (!isValidPassword) {
                return null;
            }

            return user;
        } catch (error) {
            return null;
        }
    }

    /**
     * Obtiene un usuario por email
     * @param email - Email del usuario
     * @returns Promise<User | null>
     */
    async getUserByEmail(email: string): Promise<User | null> {
        try {
            return await this.userService.findUserByEmail(email);
        } catch (error) {
            return null;
        }
    }

    /**
     * Obtiene un usuario por ID
     * @param id - ID del usuario
     * @returns Promise<User | null>
     */
    async getUserById(id: number): Promise<User | null> {
        try {
            return await this.userService.findUserById(id);
        } catch (error) {
            return null;
        }
    }

    /**
     * Actualiza el estado de verificación del usuario
     * @param userId - ID del usuario
     * @param emailVerified - Estado de verificación
     * @returns Promise<void>
     */
    async updateUserStatus(userId: number, emailVerified: boolean): Promise<void> {
        try {
            await this.userService.updateUser(userId, {
                emailVerified,
                status: emailVerified ? UserStatus.ACTIVE : UserStatus.PENDING,
                updatedAt: new Date()
            });
        } catch (error) {
            throw new ApiError(500, 'Error al actualizar usuario');
        }
    }
}