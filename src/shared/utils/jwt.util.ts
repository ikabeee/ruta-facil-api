import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: number;
    email: string;
    role: string;
    type?: 'access' | 'email_verification' | 'password_reset' | 'temp_auth';
}

export class JwtUtil {
    private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private static readonly ACCESS_TOKEN_EXPIRY = '1h';
    private static readonly EMAIL_TOKEN_EXPIRY = '24h';
    private static readonly PASSWORD_RESET_TOKEN_EXPIRY = '1h';
    private static readonly TEMP_AUTH_TOKEN_EXPIRY = '10m';

    static generateAccessToken(payload: Omit<JwtPayload, 'type'>): string {
        return jwt.sign(
            { ...payload, type: 'access' },
            this.ACCESS_TOKEN_SECRET,
            { expiresIn: this.ACCESS_TOKEN_EXPIRY }
        );
    }

    static generateEmailVerificationToken(payload: Omit<JwtPayload, 'type'>): string {
        return jwt.sign(
            { ...payload, type: 'email_verification' },
            this.ACCESS_TOKEN_SECRET,
            { expiresIn: this.EMAIL_TOKEN_EXPIRY }
        );
    }

    static generatePasswordResetToken(payload: Omit<JwtPayload, 'type'>): string {
        return jwt.sign(
            { ...payload, type: 'password_reset' },
            this.ACCESS_TOKEN_SECRET,
            { expiresIn: this.PASSWORD_RESET_TOKEN_EXPIRY }
        );
    }

    static generateTempAuthToken(payload: Omit<JwtPayload, 'type'>): string {
        return jwt.sign(
            { ...payload, type: 'temp_auth' },
            this.ACCESS_TOKEN_SECRET,
            { expiresIn: this.TEMP_AUTH_TOKEN_EXPIRY }
        );
    }

    static verifyToken(token: string): JwtPayload {
        return jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JwtPayload;
    }

    static decodeToken(token: string): JwtPayload | null {
        try {
            return jwt.decode(token) as JwtPayload;
        } catch {
            return null;
        }
    }
}