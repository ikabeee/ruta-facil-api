import { User } from "../../../generated/prisma";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRepositoryInterface } from "./interfaces/UserRepository.interface";
import { UserServiceInterface } from "./interfaces/UserService.interface";

export class UserService implements UserServiceInterface {
    constructor(
        private readonly userRepository: UserRepositoryInterface
    ) { }

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async findUserById(id: number): Promise<User> {
        return this.userRepository.findById(id);
    }

    async findUserByEmail(email: string): Promise<User> {
        return this.userRepository.findByEmail(email);
    }

    async createUser(userData: CreateUserDto): Promise<User> {
        return this.userRepository.createUser(userData);
    }

    async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
        return this.userRepository.updateUser(id, userData);
    }

    async deleteUser(id: number): Promise<void> {
        return this.userRepository.deleteUser(id);
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        // Implementation would be added here
        return this.userRepository.comparePasswords(plainPassword, hashedPassword);
    }

    async getStats(): Promise<{
        total: number;
        active: number;
        pending: number;
        byRole: {
            admin: number;
            user: number;
            driver: number;
        };
        emailVerified: number;
        recentUsers: number; // Last 30 days
    }> {
        return this.userRepository.getStats();
    }
}