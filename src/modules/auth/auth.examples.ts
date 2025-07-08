import { AuthService } from './auth.service';
import { MailService } from '../../shared/services/mail.service';

/**
 * Ejemplo de uso del módulo de autenticación
 */
export class AuthExamples {
    private authService: AuthService;
    private mailService: MailService;

    constructor() {
        this.authService = new AuthService();
        this.mailService = new MailService();
    }

    /**
     * Ejemplo completo de registro y login
     */
    async exampleUserRegistrationFlow() {
        try {
            console.log('🚀 Iniciando ejemplo de registro de usuario...');

            // 1. Registrar usuario
            const registerData = {
                name: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@example.com',
                password: 'MiPassword123!',
                confirmPassword: 'MiPassword123!',
                role: 'USER' as any,
                emailVerified: false,
                createdAt: new Date()
            };

            console.log('📝 Registrando usuario...');
            const authResponse = await this.authService.register(registerData);
            console.log('✅ Usuario registrado:', authResponse.user.email);

            // 2. Simular verificación de email (normalmente se haría desde el enlace del correo)
            console.log('📧 Simulando verificación de email...');
            // En la práctica, el token vendría del enlace del correo
            
            // 3. Login del usuario
            console.log('🔐 Iniciando sesión...');
            const loginResponse = await this.authService.login({
                email: registerData.email,
                password: registerData.password
            });
            console.log('✅ Login exitoso para:', loginResponse.user.email);
            console.log('🎫 Token JWT generado con expiración en:', loginResponse.expiresIn, 'segundos');

            return {
                user: loginResponse.user,
                token: loginResponse.token
            };

        } catch (error) {
            console.error('❌ Error en el flujo de registro:', error);
            throw error;
        }
    }

    /**
     * Ejemplo de recuperación de contraseña
     */
    async examplePasswordRecoveryFlow() {
        try {
            console.log('🔄 Iniciando ejemplo de recuperación de contraseña...');

            const email = 'juan.perez@example.com';

            // 1. Solicitar reset de contraseña
            console.log('📧 Enviando correo de recuperación...');
            await this.authService.forgotPassword({ email });
            console.log('✅ Correo de recuperación enviado a:', email);

            // 2. Simular reset de contraseña (normalmente el token vendría del correo)
            console.log('🔑 Simulando reset de contraseña...');
            // En la práctica, el token vendría del enlace del correo
            // await this.authService.resetPassword({
            //     token: 'token-from-email',
            //     newPassword: 'NuevaPassword123!',
            //     confirmPassword: 'NuevaPassword123!'
            // });

            console.log('✅ Flujo de recuperación completado');

        } catch (error) {
            console.error('❌ Error en recuperación de contraseña:', error);
            throw error;
        }
    }

    /**
     * Ejemplo de cambio de contraseña
     */
    async exampleChangePasswordFlow(userId: number) {
        try {
            console.log('🔐 Iniciando ejemplo de cambio de contraseña...');

            await this.authService.changePassword(userId, {
                currentPassword: 'MiPassword123!',
                newPassword: 'NuevaPassword456!',
                confirmPassword: 'NuevaPassword456!'
            });

            console.log('✅ Contraseña cambiada exitosamente');

        } catch (error) {
            console.error('❌ Error al cambiar contraseña:', error);
            throw error;
        }
    }

    /**
     * Ejemplo de validación de usuario
     */
    async exampleUserValidation() {
        try {
            console.log('🔍 Iniciando ejemplo de validación de usuario...');

            const user = await this.authService.validateUser(
                'juan.perez@example.com',
                'MiPassword123!'
            );

            if (user) {
                console.log('✅ Usuario válido:', user.email);
                console.log('👤 Datos del usuario:', {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    emailVerified: user.emailVerified
                });
            } else {
                console.log('❌ Credenciales inválidas');
            }

            return user;

        } catch (error) {
            console.error('❌ Error en validación:', error);
            throw error;
        }
    }

    /**
     * Ejemplo de obtener usuario actual
     */
    async exampleGetCurrentUser(userId: number) {
        try {
            console.log('👤 Obteniendo usuario actual...');

            const user = await this.authService.getCurrentUser(userId);
            console.log('✅ Usuario obtenido:', {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                emailVerified: user.emailVerified
            });

            return user;

        } catch (error) {
            console.error('❌ Error al obtener usuario:', error);
            throw error;
        }
    }

    /**
     * Ejemplo de refresh token
     */
    async exampleRefreshToken(userId: number) {
        try {
            console.log('🔄 Refrescando token...');

            const authResponse = await this.authService.refreshToken(userId);
            console.log('✅ Token refrescado exitosamente');
            console.log('🎫 Nuevo token generado con expiración en:', authResponse.expiresIn, 'segundos');

            return authResponse;

        } catch (error) {
            console.error('❌ Error al refrescar token:', error);
            throw error;
        }
    }

    /**
     * Ejemplo completo de todos los flujos
     */
    async runCompleteExample() {
        try {
            console.log('🎬 Iniciando ejemplo completo del módulo de autenticación...\n');

            // 1. Registro y login
            const { user, token } = await this.exampleUserRegistrationFlow();
            console.log('\n');

            // 2. Validación de usuario
            await this.exampleUserValidation();
            console.log('\n');

            // 3. Obtener usuario actual
            await this.exampleGetCurrentUser(user.id);
            console.log('\n');

            // 4. Refresh token
            await this.exampleRefreshToken(user.id);
            console.log('\n');

            // 5. Cambio de contraseña
            await this.exampleChangePasswordFlow(user.id);
            console.log('\n');

            // 6. Recuperación de contraseña
            await this.examplePasswordRecoveryFlow();
            console.log('\n');

            console.log('🎉 Ejemplo completo finalizado exitosamente!');

        } catch (error) {
            console.error('💥 Error en ejemplo completo:', error);
        }
    }
}

/**
 * Función para ejecutar los ejemplos
 */
export async function runAuthExamples() {
    const examples = new AuthExamples();
    await examples.runCompleteExample();
}

// Ejemplo de uso con Express middleware
export function exampleExpressRoutes() {
    console.log(`
📋 Ejemplo de uso en rutas Express:

// auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware, adminMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Rutas públicas
router.post('/register', async (req, res) => {
    await authController.register(req, res);
});

router.post('/login', async (req, res) => {
    await authController.login(req, res);
});

// Rutas protegidas
router.get('/me', authMiddleware, async (req, res) => {
    await authController.getCurrentUser(req, res);
});

// Solo administradores
router.get('/admin/users', adminMiddleware, async (req, res) => {
    // Solo administradores pueden acceder
    res.json({ message: 'Admin area' });
});

export { router as authRoutes };
    `);
}

// Ejemplo de uso en el frontend
export function exampleFrontendIntegration() {
    console.log(`
🌐 Ejemplo de integración con Frontend:

// login.js
const login = async (email, password) => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Importante para cookies
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login exitoso:', data.data.user);
            
            // Las cookies se configuran automáticamente
            // Redirigir a dashboard
            window.location.href = '/dashboard';
        } else {
            const error = await response.json();
            console.error('Error de login:', error.message);
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
};

// Obtener datos del usuario desde cookies
const getUserFromCookie = () => {
    const sessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-session='));
        
    if (sessionCookie) {
        const sessionData = sessionCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(sessionData));
    }
    
    return null;
};

// Verificar autenticación
const checkAuth = async () => {
    try {
        const response = await fetch('/api/auth/check', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.data.user;
        }
    } catch (error) {
        console.log('Usuario no autenticado');
    }
    return null;
};

// Logout
const logout = async () => {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        window.location.href = '/login';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
};
    `);
}

// Ejecutar ejemplos si este archivo se ejecuta directamente
if (require.main === module) {
    runAuthExamples().then(() => {
        console.log('\n');
        exampleExpressRoutes();
        console.log('\n');
        exampleFrontendIntegration();
    });
}
