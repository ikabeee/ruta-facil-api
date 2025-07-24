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
                    ...(userData.password && { password: await bcrypt.hash(userData.password, 10) }),
                    updatedAt: userData.updatedAt || new Date() // Generar automáticamente si no se proporciona
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

    // Nuevo método para obtener usuarios por rol
    async findByRole(role: string): Promise<User[]> {
        try {
            const users = await this.prisma.user.findMany({
                where: { 
                    role: role as any,
                    status: 'ACTIVE' // Solo usuarios activos
                },
                orderBy: { name: 'asc' }
            });
            return users;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar usuarios por rol ${role}: ${error.message}`);
        }
    }

    // Nuevo método para obtener usuarios disponibles para ser conductores
    async findAvailableDriverUsers(): Promise<User[]> {
        try {
            // Buscar usuarios que:
            // 1. Tengan rol DRIVER o USER (se puede convertir a driver)
            // 2. Estén activos
            // 3. No tengan ya configuración de conductor (license, etc.)
            const users = await this.prisma.user.findMany({
                where: {
                    OR: [
                        { role: 'DRIVER' },
                        { role: 'USER' }
                    ],
                    status: 'ACTIVE',
                    // Si license es null, significa que no ha sido configurado como conductor
                    license: null
                },
                orderBy: { name: 'asc' }
            });
            return users;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar usuarios disponibles para conductores: ${error.message}`);
        }
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
        recentUsers: number;
        lastUpdated: string;
    }> {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const [
                total,
                active,
                pending,
                adminCount,
                userCount,
                driverCount,
                emailVerified,
                recentUsers
            ] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.user.count({ where: { status: 'ACTIVE' } }),
                this.prisma.user.count({ where: { status: 'PENDING' } }),
                this.prisma.user.count({ where: { role: 'ADMIN' } }),
                this.prisma.user.count({ where: { role: 'USER' } }),
                this.prisma.user.count({ where: { role: 'DRIVER' } }),
                this.prisma.user.count({ where: { emailVerified: true } }),
                this.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } })
            ]);

            return {
                total,
                active,
                pending,
                byRole: {
                    admin: adminCount,
                    user: userCount,
                    driver: driverCount
                },
                emailVerified,
                recentUsers,
                lastUpdated: new Date().toISOString()
            };
        } catch (error: any) {
            throw new ApiError(500, `Error al obtener estadísticas de usuarios: ${error.message}`);
        }
    }
}