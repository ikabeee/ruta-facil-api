import { Response } from 'express';
import { UserSession } from '../../modules/auth/interfaces/Auth.interface';

export class CookieHelper {
    private static readonly COOKIE_NAME = 'ruta-facil-auth';
    private static readonly COOKIE_OPTIONS = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
        path: '/'
    };

    /**
     * Establece la cookie de autenticación
     * @param res - Response object de Express
     * @param token - Token JWT
     * @param userSession - Datos de sesión del usuario
     */
    public static setAuthCookie(res: Response, token: string, userSession: UserSession): void {
        // Cookie con el token JWT
        res.cookie(this.COOKIE_NAME, token, this.COOKIE_OPTIONS);
        
        // Cookie adicional con datos de sesión (no sensibles)
        res.cookie('user-session', JSON.stringify({
            id: userSession.id,
            email: userSession.email,
            role: userSession.role,
            name: userSession.name
        }), {
            ...this.COOKIE_OPTIONS,
            httpOnly: false, // Permitir acceso desde el frontend
            maxAge: this.COOKIE_OPTIONS.maxAge
        });
    }

    /**
     * Limpia las cookies de autenticación
     * @param res - Response object de Express
     */
    public static clearAuthCookies(res: Response): void {
        res.clearCookie(this.COOKIE_NAME, {
            path: '/',
            domain: process.env.COOKIE_DOMAIN
        });
        
        res.clearCookie('user-session', {
            path: '/',
            domain: process.env.COOKIE_DOMAIN
        });
    }

    /**
     * Obtiene el token de la cookie
     * @param cookies - Cookies del request
     * @returns Token JWT o null si no existe
     */
    public static getTokenFromCookies(cookies: any): string | null {
        return cookies[this.COOKIE_NAME] || null;
    }

    /**
     * Obtiene los datos de sesión de la cookie
     * @param cookies - Cookies del request
     * @returns Datos de sesión o null si no existe
     */
    public static getSessionFromCookies(cookies: any): UserSession | null {
        try {
            const sessionData = cookies['user-session'];
            if (!sessionData) return null;
            
            return JSON.parse(sessionData);
        } catch (error) {
            return null;
        }
    }

    /**
     * Verifica si las cookies de autenticación existen
     * @param cookies - Cookies del request
     * @returns true si existen las cookies necesarias
     */
    public static hasAuthCookies(cookies: any): boolean {
        return !!(cookies[this.COOKIE_NAME] && cookies['user-session']);
    }

    /**
     * Establece cookie de "recordar sesión"
     * @param res - Response object de Express
     * @param token - Token JWT de larga duración
     * @param userSession - Datos de sesión del usuario
     */
    public static setRememberMeCookie(res: Response, token: string, userSession: UserSession): void {
        const rememberMeOptions = {
            ...this.COOKIE_OPTIONS,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
        };

        res.cookie(`${this.COOKIE_NAME}-remember`, token, rememberMeOptions);
        
        res.cookie('user-session-remember', JSON.stringify({
            id: userSession.id,
            email: userSession.email,
            role: userSession.role,
            name: userSession.name
        }), {
            ...rememberMeOptions,
            httpOnly: false
        });
    }

    /**
     * Limpia las cookies de "recordar sesión"
     * @param res - Response object de Express
     */
    public static clearRememberMeCookies(res: Response): void {
        res.clearCookie(`${this.COOKIE_NAME}-remember`, {
            path: '/',
            domain: process.env.COOKIE_DOMAIN
        });
        
        res.clearCookie('user-session-remember', {
            path: '/',
            domain: process.env.COOKIE_DOMAIN
        });
    }
}
