import { PrismaClient, User, UserRole, UserStatus } from "../../../generated/prisma";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto, ResendVerificationDto, Verify2FADto, ResendOTPDto } from "./dto/auth.dto";
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
    
    // Almacenamiento temporal de códigos OTP (en producción usar Redis)
    private otpCodes: Map<string, { code: string; expiresAt: Date }> = new Map();

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
            // Validar usuario - ESTE ES EL PUNTO CRÍTICO
            const user = await this.validateUser(data.email, data.password);
            if (!user) {
                // Si las credenciales son inválidas, NO enviar OTP
                throw new ApiError(401, 'Credenciales inválidas');
            }

            // Verificar si el usuario está activo
            if (user.status !== UserStatus.ACTIVE) {
                throw new ApiError(403, 'Usuario inactivo. Contacte al administrador');
            }

            // SOLO SI LAS CREDENCIALES SON VÁLIDAS: Enviar OTP
            console.log(`🔐 Credenciales válidas para ${user.email}, enviando código OTP...`);
            
            // Generar y enviar código OTP
            const otpCode = this.generateOTPCode(user.email);
            
            // Enviar código OTP por correo
            try {
                const mailResult = await this.mailService.sendOTPCode(user.email, otpCode, user.name);
                if (!mailResult.success) {
                    console.error('Error enviando código OTP:', mailResult.error);
                    throw new ApiError(500, 'Error enviando código de verificación. Intenta nuevamente.');
                }
                console.log(`✅ Código OTP enviado exitosamente a ${user.email}: ${otpCode}`);
            } catch (mailError) {
                console.error('Error en envío de correo OTP:', mailError);
                throw new ApiError(500, 'Error enviando código de verificación. Intenta nuevamente.');
            }

            // Lanzar error con información de que se requiere OTP
            throw new ApiError(422, `REQUIRES_OTP_VERIFICATION:${user.email}`);
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
     * Completa el login después de la verificación OTP exitosa
     * @param email - Email del usuario
     * @returns Promise<AuthResponse>
     */
    async completeLoginAfterOTP(email: string): Promise<AuthResponse> {
        try {
            console.log('🔄 Iniciando completeLoginAfterOTP para:', email);
            
            // Obtener usuario por email
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new ApiError(401, 'Usuario no encontrado');
            }

            // Verificar si el usuario está activo
            if (user.status !== UserStatus.ACTIVE) {
                throw new ApiError(403, 'Usuario inactivo. Contacte al administrador');
            }

            // Generar tokens después de OTP exitoso
            const tokenData = JwtHelper.generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            });

            console.log('🎫 Token generado exitosamente. Length:', tokenData.token.length);
            console.log('⏰ Token expira en:', tokenData.expiresIn, 'segundos');

            const authResponse = {
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

            console.log('✅ AuthResponse creado exitosamente:', {
                hasUser: !!authResponse.user,
                hasToken: !!authResponse.token,
                tokenLength: authResponse.token.length,
                userEmail: authResponse.user.email
            });

            return authResponse;
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
     * Reenvía el código OTP para login
     * @param data - Datos de reenvío
     * @returns Promise<void>
     */
    async resendOTP(data: ResendOTPDto): Promise<void> {
        try {
            const user = await this.getUserByEmail(data.email);
            if (!user) {
                throw new ApiError(404, 'Usuario no encontrado');
            }

            // Verificar si el usuario está activo y verificado
            if (user.status !== UserStatus.ACTIVE) {
                throw new ApiError(403, 'Usuario inactivo. Contacte al administrador');
            }

            if (!user.emailVerified) {
                throw new ApiError(400, 'Debe verificar su correo electrónico antes de solicitar un nuevo código OTP');
            }

            // Generar nuevo código OTP
            const otpCode = this.generateOTPCode(user.email);

            // Enviar código OTP por correo
            try {
                const mailResult = await this.mailService.sendOTPCode(user.email, otpCode, user.name);
                if (!mailResult.success) {
                    console.error('Error enviando código OTP:', mailResult.error);
                    throw new ApiError(500, 'Error enviando código de verificación. Intenta nuevamente.');
                }
                console.log(`✅ Código OTP reenviado exitosamente a ${user.email}: ${otpCode}`);
            } catch (mailError) {
                console.error('Error en envío de correo OTP:', mailError);
                throw new ApiError(500, 'Error enviando código de verificación. Intenta nuevamente.');
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error interno del servidor');
        }
    }

    /**
     * Verifica el código de verificación (2FA/Email/OTP para Login)
     * @param data - Datos de verificación
     * @returns Promise<AuthResponse | void> - Retorna AuthResponse si es OTP de login, void si es verificación de email
     */
    async verify2FA(data: Verify2FADto): Promise<AuthResponse | void> {
        try {
            // El código viene directamente como un código de verificación de email
            // Verificar si es un token JWT (verificación por email)
            try {
                // Intentar verificar como token JWT
                await this.verifyEmail({ token: data.code });
                return;
            } catch (tokenError) {
                // Si no es un token JWT válido, verificar si es un código OTP de 6 dígitos
                if (/^\d{6}$/.test(data.code)) {
                    // Es un código de 6 dígitos - puede ser para verificación de email o login OTP
                    console.log('🔐 Código OTP de 6 dígitos recibido:', data.code);
                    
                    if (data.email) {
                        // Si se proporciona email, buscar específicamente ese usuario
                        console.log('📧 Buscando usuario con email:', data.email);
                        const foundUser = await this.getUserByEmail(data.email);
                        if (!foundUser) {
                            throw new ApiError(400, 'Usuario no encontrado');
                        }
                        
                        // Verificar si es para login OTP (usuario activo) o verificación de email (pendiente)
                        console.log('🔍 Verificando condiciones del usuario:');
                        console.log('- Status:', foundUser.status);
                        console.log('- EmailVerified:', foundUser.emailVerified);
                        console.log('- UserStatus.ACTIVE:', UserStatus.ACTIVE);
                        
                        if (foundUser.status === UserStatus.ACTIVE && foundUser.emailVerified) {
                            // Es un OTP para completar login
                            console.log('� Procesando OTP para completar login');
                            
                            // TEMPORAL: Permitir ciertos códigos para testing
                            const testCodes = ['123456', '000000', '111111', '999999'];
                            if (testCodes.includes(data.code)) {
                                console.log('✅ Código de testing aceptado, completando login');
                                const loginResult = await this.completeLoginAfterOTP(foundUser.email);
                                console.log('🎫 Login result:', { hasToken: !!loginResult.token, hasUser: !!loginResult.user });
                                return loginResult;
                            }
                            
                            // Validar código OTP usando el nuevo método
                            if (this.validateOTPCodeForEmail(foundUser.email, data.code)) {
                                console.log('✅ OTP válido, completando login');
                                const loginResult = await this.completeLoginAfterOTP(foundUser.email);
                                console.log('🎫 Login result:', { hasToken: !!loginResult.token, hasUser: !!loginResult.user });
                                return loginResult;
                            } else {
                                console.log('❌ OTP inválido para login');
                                throw new ApiError(400, 'Código OTP inválido o expirado');
                            }
                        } else if (!foundUser.emailVerified || foundUser.status === UserStatus.PENDING) {
                            // Es verificación de email
                            console.log('📧 Procesando verificación de email');
                            
                            // Validar código para verificación de email (simulación)
                            if (data.code === '123456' || this.validateEmailVerificationCode(data.code)) {
                                await this.updateUserStatus(foundUser.id, true);
                                console.log(`✅ Usuario ${foundUser.email} verificado exitosamente`);
                                return; // Void para verificación de email
                            } else {
                                throw new ApiError(400, 'Código de verificación inválido');
                            }
                        } else {
                            throw new ApiError(400, 'Estado de usuario inválido para esta operación');
                        }
                    } else {
                        // Si no se proporciona email, buscar el usuario más reciente no verificado (legacy)
                        console.log('🔍 Buscando usuario más reciente no verificado');
                        const unverifiedUsers = await this.prisma.user.findMany({
                            where: {
                                emailVerified: false,
                                status: UserStatus.PENDING
                            },
                            orderBy: {
                                createdAt: 'desc'
                            },
                            take: 1
                        });
                        
                        if (unverifiedUsers.length === 0) {
                            throw new ApiError(400, 'No hay usuarios pendientes de verificación');
                        }
                        
                        const userToVerify = unverifiedUsers[0];
                        
                        // Validar código para verificación de email
                        if (data.code === '123456' || this.validateEmailVerificationCode(data.code)) {
                            await this.updateUserStatus(userToVerify.id, true);
                            console.log(`✅ Usuario ${userToVerify.email} verificado exitosamente`);
                            return; // Void para verificación de email
                        } else {
                            throw new ApiError(400, 'Código de verificación inválido');
                        }
                    }
                } else {
                    throw new ApiError(400, 'Código de verificación inválido o expirado');
                }
            }
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

    /**
     * Valida código de verificación de email (implementación temporal)
     * @param code - Código de verificación
     * @returns boolean
     */
    private validateEmailVerificationCode(code: string): boolean {
        // Implementación temporal: acepta códigos específicos
        // En producción esto debería validar contra códigos generados y almacenados
        const validCodes = ['123456', '000000', '111111'];
        return validCodes.includes(code);
    }

    /**
     * Genera un código OTP de 6 dígitos y lo almacena temporalmente
     * @param email - Email del usuario para asociar el código
     * @returns string - Código OTP generado
     */
    private generateOTPCode(email: string): string {
        // Generar código de 6 dígitos aleatorio
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Almacenar código con expiración de 10 minutos
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        
        this.otpCodes.set(email, { code, expiresAt });
        
        console.log(`🔑 Código OTP generado para ${email}: ${code} (expira: ${expiresAt.toLocaleString()})`);
        return code;
    }

    /**
     * Valida un código OTP para un email específico
     * @param email - Email del usuario
     * @param code - Código a validar
     * @returns boolean
     */
    private validateOTPCodeForEmail(email: string, code: string): boolean {
        // Códigos de desarrollo que siempre funcionan
        const devCodes = ['123456', '000000', '111111'];
        if (devCodes.includes(code)) {
            return true;
        }

        // Verificar código almacenado
        const storedOTP = this.otpCodes.get(email);
        if (!storedOTP) {
            console.log(`❌ No hay código OTP almacenado para ${email}`);
            return false;
        }

        // Verificar si el código no ha expirado
        if (new Date() > storedOTP.expiresAt) {
            console.log(`⏰ Código OTP expirado para ${email}`);
            this.otpCodes.delete(email); // Limpiar código expirado
            return false;
        }

        // Verificar si el código coincide
        const isValid = storedOTP.code === code;
        if (isValid) {
            console.log(`✅ Código OTP válido para ${email}`);
            this.otpCodes.delete(email); // Limpiar código usado
        } else {
            console.log(`❌ Código OTP inválido para ${email}. Esperado: ${storedOTP.code}, Recibido: ${code}`);
        }

        return isValid;
    }
}