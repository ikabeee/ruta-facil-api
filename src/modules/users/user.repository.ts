import { PrismaClient, User } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRepositoryInterface } from "./interfaces/UserRepository.interface";
import * as bcrypt from "bcrypt";

export class UserRepository implements UserRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }
    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users;
    }
    async findById(id: number): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id }
            });
            if (!user) {
                throw new ApiError(404, `Usuario con id ${id} no encontrado.`);
            }
            return user;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el usuario con id ${id}`);
        }

    }
    async findByEmail(email: string): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                throw new ApiError(404, `Usuario con email ${email} no encontrado.`);
            }
            return user;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el usuario con email ${email}`);
        }
    }
    async createUser(userData: CreateUserDto): Promise<User> {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: userData.email }
            });

            if (existingUser) {
                throw new ApiError(409, `Usuario con email ${userData.email} ya existe.`);
            }
            const { password, ...data } = userData;
            const user = await this.prisma.user.create({
                data: {
                    ...data,
                    password: await this.hashPassword(password)
                }
            });
            return user;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear el usuario: ${error.message}`);
        }

    }
    async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id }
            });
            if (!user) {
                throw new ApiError(404, `Usuario con id ${id} no encontrado.`);
            }
            const userUpdated = await this.prisma.user.update({
                where: { id },
                data: {
                    ...userData,
                    ...(userData.password && { password: await bcrypt.hash(userData.password, 10) })
                }
            });
            return userUpdated;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar el usuario con id ${id}`);
        }

    }
    async deleteUser(id: number): Promise<void> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id }
            });
            if (!user) {
                throw new ApiError(404, `Usuario con id ${id} no encontrado.`);
            }
            await this.prisma.user.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el usuario con id ${id}`);
        }
    }
    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }
    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}