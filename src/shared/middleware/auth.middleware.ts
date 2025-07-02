import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: string;
    };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Token de acceso requerido'
        });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET || 'default-secret', (err: any, user: any) => {
        if (err) {
            res.status(403).json({
                success: false,
                message: 'Token inválido'
            });
            return;
        }

        req.user = user;
        next();
    });
};

export const requireRole = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Acceso no autorizado'
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Permisos insuficientes'
            });
            return;
        }

        next();
    };
};