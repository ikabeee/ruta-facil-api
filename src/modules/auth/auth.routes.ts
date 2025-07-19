import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller';
import { authMiddleware, optionalAuthMiddleware } from '../../shared/middleware/auth.middleware';
import { GoogleOAuthStrategy } from '../../shared/strategies/google-oauth.strategy';

// Inicializar la estrategia de Google
new GoogleOAuthStrategy();

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

// Rutas OAuth - Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { session: false }), 
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

export { router as authRoutes };