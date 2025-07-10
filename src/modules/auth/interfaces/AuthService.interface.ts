import { Response } from "express";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto, ResendVerificationDto } from "../dto/auth.dto";
import { AuthResponse, UserSession } from "./Auth.interface";
import { User } from "../../../../generated/prisma";

export interface AuthServiceInterface {
    login(data: LoginDto): Promise<AuthResponse>;
    register(data: RegisterDto): Promise<AuthResponse>;
    forgotPassword(data: ForgotPasswordDto): Promise<void>;
    resetPassword(data: ResetPasswordDto): Promise<void>;
    changePassword(userId: number, data: ChangePasswordDto): Promise<void>;
    verifyEmail(data: VerifyEmailDto): Promise<void>;
    resendVerification(data: ResendVerificationDto): Promise<void>;
    getCurrentUser(userId: number): Promise<User>;
    refreshToken(userId: number): Promise<AuthResponse>;
    logout(userId: number, res?: Response): Promise<void>;
    validateUser(email: string, password: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    updateUserStatus(userId: number, emailVerified: boolean): Promise<void>;
}