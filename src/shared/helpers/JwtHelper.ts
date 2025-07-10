import jwt from 'jsonwebtoken';
import { JwtPayload, TokenData } from '../../modules/auth/interfaces/Auth.interface';
import { ApiError } from '../errors/ApiError';

export class JwtHelper {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
    private static readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    /**
     * Genera un token JWT
     * @param payload - Datos del usuario
     * @returns TokenData con el token y tiempo de expiración
     */
    public static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenData {
        if (!this.JWT_SECRET) {
            throw new ApiError(500, 'JWT_SECRET no está configurado');
        }

        const token = jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN
        } as any);

        // Calcular tiempo de expiración en segundos
        const expiresIn = this.getExpirationTime(this.JWT_EXPIRES_IN);

        return {
            token,
            expiresIn
        };
    }

    /**
     * Genera un token de refresh
     * @param payload - Datos del usuario
     * @returns Token de refresh
     */
    public static generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
        if (!this.JWT_SECRET) {
            throw new ApiError(500, 'JWT_SECRET no está configurado');
        }

        return jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_REFRESH_EXPIRES_IN
        } as any);
    }

    /**
     * Verifica y decodifica un token JWT
     * @param token - Token a verificar
     * @returns Payload del token
     */
    public static verifyToken(token: string): JwtPayload {
        try {
            if (!this.JWT_SECRET) {
                throw new ApiError(500, 'JWT_SECRET no está configurado');
            }

            const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiError(401, 'Token expirado');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ApiError(401, 'Token inválido');
            } else {
                throw new ApiError(500, 'Error al verificar token');
            }
        }
    }

    /**
     * Genera un token temporal para reset de contraseña
     * @param email - Email del usuario
     * @returns Token temporal
     */
    public static generatePasswordResetToken(email: string): string {
        if (!this.JWT_SECRET) {
            throw new ApiError(500, 'JWT_SECRET no está configurado');
        }

        return jwt.sign(
            { email, type: 'password-reset' },
            this.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    /**
     * Genera un token temporal para verificación de email
     * @param email - Email del usuario
     * @returns Token temporal
     */
    public static generateEmailVerificationToken(email: string): string {
        if (!this.JWT_SECRET) {
            throw new ApiError(500, 'JWT_SECRET no está configurado');
        }

        return jwt.sign(
            { email, type: 'email-verification' },
            this.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    /**
     * Verifica un token temporal
     * @param token - Token a verificar
     * @param expectedType - Tipo esperado del token
     * @returns Email del token
     */
    public static verifyTemporaryToken(token: string, expectedType: string): string {
        try {
            if (!this.JWT_SECRET) {
                throw new ApiError(500, 'JWT_SECRET no está configurado');
            }

            const decoded = jwt.verify(token, this.JWT_SECRET) as any;
            
            if (decoded.type !== expectedType) {
                throw new ApiError(400, 'Tipo de token inválido');
            }

            return decoded.email;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiError(401, 'Token expirado');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ApiError(401, 'Token inválido');
            } else if (error instanceof ApiError) {
                throw error;
            } else {
                throw new ApiError(500, 'Error al verificar token');
            }
        }
    }

    /**
     * Extrae el token del header de autorización
     * @param authHeader - Header de autorización
     * @returns Token limpio
     */
    public static extractTokenFromHeader(authHeader: string | undefined): string {
        if (!authHeader) {
            throw new ApiError(401, 'Token de autorización requerido');
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new ApiError(401, 'Formato de token inválido');
        }

        return parts[1];
    }

    /**
     * Convierte string de tiempo a segundos
     * @param timeString - String de tiempo (ej: '24h', '7d')
     * @returns Tiempo en segundos
     */
    private static getExpirationTime(timeString: string): number {
        const timeValue = parseInt(timeString.slice(0, -1));
        const timeUnit = timeString.slice(-1);

        switch (timeUnit) {
            case 's':
                return timeValue;
            case 'm':
                return timeValue * 60;
            case 'h':
                return timeValue * 60 * 60;
            case 'd':
                return timeValue * 24 * 60 * 60;
            default:
                return 24 * 60 * 60; // 24 horas por defecto
        }
    }

    /**
     * Decodifica un token sin verificarlo (para debugging)
     * @param token - Token a decodificar
     * @returns Payload del token
     */
    public static decodeToken(token: string): any {
        return jwt.decode(token);
    }
}
