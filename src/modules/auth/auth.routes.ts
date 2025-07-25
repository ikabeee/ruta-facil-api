import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller';
import { authMiddleware, optionalAuthMiddleware } from '../../shared/middleware/auth.middleware';
import { GoogleOAuthStrategy } from '../../shared/strategies/google-oauth.strategy';

// Inicializar la estrategia de Google
console.log('🔧 Inicializando Google OAuth Strategy...');
new GoogleOAuthStrategy();
console.log('✅ Google OAuth Strategy inicializada');

const router = Router();
const authController = new AuthController();

// Rutas públicas (sin autenticación)
router.post('/login', async (req, res) => {
    await authController.login(req, res);
});

router.post('/register', async (req, res) => {
    await authController.register(req, res);
});

router.post('/forgot-password', async (req, res) => {
    await authController.forgotPassword(req, res);
});

router.post('/reset-password', async (req, res) => {
    await authController.resetPassword(req, res);
});

router.post('/verify-email', async (req, res) => {
    await authController.verifyEmail(req, res);
});

router.post('/resend-verification', async (req, res) => {
    await authController.resendVerification(req, res);
});

router.post('/resend-otp', async (req, res) => {
    await authController.resendOTP(req, res);
});

router.post('/verify-2fa', async (req, res) => {
    await authController.verify2FA(req, res);
});

// Rutas OAuth - Google
console.log('🔗 Registrando ruta GET /google para OAuth...');
router.get('/google', (req, res, next) => {
    console.log('🚀 Iniciando autenticación con Google...');
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account' // Permite al usuario seleccionar cuenta
    })(req, res, next);
});

console.log('🔗 Registrando ruta GET /google/callback para OAuth...');
router.get('/google/callback', 
    (req, res, next) => {
        console.log('📥 Callback de Google OAuth recibido');
        passport.authenticate('google', { 
            session: false,
            failureRedirect: `${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`
        })(req, res, next);
    }, 
    async (req, res) => {
        await authController.googleCallback(req, res);
    }
);

// Rutas protegidas (requieren autenticación)
router.get('/me', authMiddleware, async (req, res) => {
    await authController.getCurrentUser(req, res);
});

router.post('/change-password', authMiddleware, async (req, res) => {
    await authController.changePassword(req, res);
});

router.post('/refresh-token', authMiddleware, async (req, res) => {
    await authController.refreshToken(req, res);
});

router.post('/logout', optionalAuthMiddleware, async (req, res) => {
    await authController.logout(req, res);
});

router.get('/check', authMiddleware, async (req, res) => {
    await authController.checkAuth(req, res);
});

console.log('✅ Todas las rutas de autenticación registradas correctamente');
console.log('📋 Rutas disponibles: /login, /register, /verify-email, /resend-verification, /resend-otp, /verify-2fa, /google, /google/callback, /logout, /check');

export { router as authRoutes };