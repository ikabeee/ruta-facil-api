export interface RegisterRequest {
    name: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface VerifyOTPRequest {
    sessionId: string;
    otp: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface UserSession {
    name: string;
    lastName?: string;
    role: string;
    status: string;
}

export interface LoginSession {
    userId: number;
    email: string;
    otp: string;
    expiresAt: Date;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        lastName?: string;
        email: string;
        role: string;
        status: string;
    };
}