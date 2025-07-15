import { User } from "../../../../generated/prisma";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface UserServiceInterface {
    findAllUsers(): Promise<User[]>;
    findUserById(id: number): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    createUser(userData: CreateUserDto): Promise<User>;
    updateUser(id: number, userData: UpdateUserDto): Promise<User>;
    deleteUser(id: number): Promise<void>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
    getStats(): Promise<{
        total: number;
        active: number;
        pending: number;
        byRole: {
            admin: number;
            user: number;
            driver: number;
        };
        emailVerified: number;
        recentUsers: number;
    }>;
}