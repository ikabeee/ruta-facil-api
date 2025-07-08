import { UserRole } from "../../../../generated/prisma";

export interface JwtPayload {
    id: number;
    email: string;
    role: UserRole;
    name: string;
    iat?: number;
    exp?: number;
}

export interface AuthResponse {
    user: {
        id: number;
        name: string;
        lastName?: string;
        email: string;
        role: UserRole;
        emailVerified: boolean;
    };
    token: string;
    expiresIn: number;
}

export interface UserSession {
    id: number;
    email: string;
    role: UserRole;
    name: string;
}

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface PasswordResetToken {
    token: string;
    email: string;
    expiresAt: Date;
}

export interface EmailVerificationToken {
    token: string;
    email: string;
    expiresAt: Date;
}
