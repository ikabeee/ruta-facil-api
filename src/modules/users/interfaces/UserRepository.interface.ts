import { User } from "../../../../generated/prisma";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface UserRepositoryInterface {
    findAll (): Promise<User[]>;
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    createUser(userData: CreateUserDto): Promise<User>;
    updateUser(id: number, userData: UpdateUserDto): Promise<User>;
    deleteUser(id: number): Promise<void>;
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}