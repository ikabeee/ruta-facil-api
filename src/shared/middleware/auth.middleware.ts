import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from '../helpers/JwtHelper';
import { CookieHelper } from '../helpers/CookieHelper';
import { ApiError } from '../errors/ApiError';
import { ApiResponse } from '../helpers/ApiResponse';
import { JwtPayload } from '../../modules/auth/interfaces/Auth.interface';
import { UserRole } from '../../../generated/prisma';

// Extender la interfaz Request para incluir el usuario
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Middleware para verificar autenticación
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | null = null;

        // Intentar obtener token del header Authorization
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = JwtHelper.extractTokenFromHeader(authHeader);
        }

        // Si no hay token en header, intentar obtenerlo de las cookies
        if (!token) {
            token = CookieHelper.getTokenFromCookies(req.cookies);
        }

        if (!token) {
            ApiResponse.error(res, 'Token de autenticación requerido', 401);
            return;
        }

        // Verificar token
        const payload = JwtHelper.verifyToken(token);
        req.user = payload;

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            ApiResponse.error(res, error.message, error.statusCode);
            return;
        }
        ApiResponse.error(res, 'Error de autenticación', 401);
        return;
    }
};

/**
 * Middleware para verificar roles específicos
 */
export const roleMiddleware = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                ApiResponse.error(res, 'Usuario no autenticado', 401);
                return;
            }

            if (!allowedRoles.includes(req.user.role)) {
                ApiResponse.error(res, 'Acceso denegado. Permisos insuficientes', 403);
                return;
            }

            next();
        } catch (error) {
            ApiResponse.error(res, 'Error de autorización', 403);
            return;
        }
    };
};

/**
 * Middleware para verificar si el usuario es administrador
 */
export const adminMiddleware = roleMiddleware([UserRole.ADMIN]);

/**
 * Middleware para verificar si el usuario es conductor
 */
export const driverMiddleware = roleMiddleware([UserRole.DRIVER, UserRole.ADMIN]);

/**
 * Middleware para verificar si el usuario es propietario de vehículo
 */
export const ownerMiddleware = roleMiddleware([UserRole.OWNER_VEHICLE, UserRole.ADMIN]);

/**
 * Middleware para verificar múltiples roles
 */
export const multiRoleMiddleware = (allowedRoles: UserRole[]) => {
    return roleMiddleware(allowedRoles);
};

/**
 * Middleware para autenticación opcional (no falla si no hay token)
 */
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | null = null;

        // Intentar obtener token del header Authorization
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = JwtHelper.extractTokenFromHeader(authHeader);
        }

        // Si no hay token en header, intentar obtenerlo de las cookies
        if (!token) {
            token = CookieHelper.getTokenFromCookies(req.cookies);
        }

        if (token) {
            try {
                const payload = JwtHelper.verifyToken(token);
                req.user = payload;
            } catch (error) {
                // Si el token es inválido, continuar sin usuario
                req.user = undefined;
            }
        }

        next();
    } catch (error) {
        next();
    }
};

/**
 * Middleware para verificar si el usuario puede acceder a su propio recurso
 */
export const ownershipMiddleware = (getUserIdFromParams: (req: Request) => number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                ApiResponse.error(res, 'Usuario no autenticado', 401);
                return;
            }

            // Los admins pueden acceder a cualquier recurso
            if (req.user.role === UserRole.ADMIN) {
                return next();
            }

            const resourceUserId = getUserIdFromParams(req);
            
            if (req.user.id !== resourceUserId) {
                ApiResponse.error(res, 'Acceso denegado. Solo puedes acceder a tus propios recursos', 403);
                return;
            }

            next();
        } catch (error) {
            ApiResponse.error(res, 'Error de autorización', 403);
            return;
        }
    };
};

/**
 * Middleware para verificar si el usuario puede acceder a su propio perfil
 */
export const profileOwnershipMiddleware = ownershipMiddleware((req: Request) => {
    return parseInt(req.params.id || req.params.userId || '0');
});

/**
 * Middleware para logging de autenticación
 */
export const authLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        console.log(`[AUTH] Usuario autenticado: ${req.user.email} (${req.user.role}) - ${req.method} ${req.path}`);
    }
    next();
};
