import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";

export interface AuthServiceInterface {
    login(data: LoginDto): Promise<null>;
    register(data: RegisterDto): Promise<null>;
    validateUser(email: string, password: string): Promise<boolean>;
    sendOTP(email: string): Promise<void>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
    resetPassword(email: string, newPassword: string): Promise<void>;
    changePassword(email: string, oldPassword: string, newPassword: string): Promise<void>;
    getCurrentUser(): Promise<null>;
    logout(): Promise<void>;
}