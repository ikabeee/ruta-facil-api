import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";

export interface AuthServiceInterface {
    login(data: LoginDto): Promise<null>;
    register(data: RegisterDto): Promise<null>;
    validateUser(email: string, password: string): Promise<boolean>;
    
    getCurrentUser(): Promise<null>;
    logout(): Promise<void>;
}