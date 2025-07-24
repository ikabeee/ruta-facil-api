import { User } from "../../../../generated/prisma";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UpdateDriverProfileDto, UpdateOwnerProfileDto } from "../dto/update-profiles.dto";

export interface UserServiceInterface {
    findAllUsers(): Promise<User[]>;
    findUserById(id: number): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    findUsersByRole(role: string): Promise<User[]>; // Nuevo método
    findAvailableDriverUsers(): Promise<User[]>; // Nuevo método
    createUser(userData: CreateUserDto): Promise<User>;
    updateUser(id: number, userData: UpdateUserDto): Promise<User>;
    deleteUser(id: number): Promise<void>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
    
    // Nuevos métodos para perfiles específicos
    updateDriverProfile(userId: number, driverData: UpdateDriverProfileDto): Promise<User>;
    updateOwnerProfile(userId: number, ownerData: UpdateOwnerProfileDto): Promise<User>;
    getDriverUsers(): Promise<User[]>;
    getOwnerUsers(): Promise<User[]>;
    
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
        lastUpdated: string;
    }>;
}