import { PrismaClient, User, UserRole, UserStatus } from "../../../../generated/prisma";
import { CreateUserDto } from "../dto/createUser.dto";
import { UpdateUserDto } from "../dto/updateUser.dto";
import { UserRepositoryInterface } from "../interfaces/userRepository.interface";


export class UserRepository implements UserRepositoryInterface {
    constructor(private readonly prisma: PrismaClient) { }
    async getUsers(): Promise<{ code: string, message: string, timestamp: Date, data: User[] }> {
        const users = await this.prisma.user.findMany();
        return { code: "200", message: "Users retrieved successfully", timestamp: new Date(), data: users };
    }
    async getUserById(id: number): Promise<{ code: string, message: string, timestamp: Date, data: User }> {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            return { code: "200", message: "Usuario encontrado satisfactoriamente", timestamp: new Date(), data: user };
        } catch (error: any) {
            throw new Error(`Error encontrando el usuario: ${error.message}`);
        }
    }
    async createUser(data: CreateUserDto): Promise<{ code: string, message: string, timestamp: Date, data: User }> {
        try {
            const newUser = {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                phone: data.phone,
                role: UserRole.USER,
                status: UserStatus.PENDING,
                createdAt: new Date(),
                updatedAt: null,
            }
            const user = await this.prisma.user.create({ data: newUser });
            return { code: "201", message: "Usuario creado satisfactoriamente", timestamp: new Date(), data: user };
        } catch (error: any) {
            throw new Error(`Error creando un usuario: ${error.message}`);
        }
    }

    async updateUser(id: number, data: UpdateUserDto): Promise<{ code: string; message: string; timestamp: Date; data: User; }> {
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    name: data.name,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    updatedAt: new Date(),
                },
            });
            return { code: "200", message: "Usuario actualizado satisfactoriamente", timestamp: new Date(), data: updatedUser };
        } catch (error: any) {
            throw new Error(`Error actualizando el usuario: ${error.message}`);
        }
    }

    async deleteUser(id: number): Promise<{ code: string; message: string; timestamp: Date; data: User; }> {
        try {
            const deletedUser = await this.prisma.user.delete({ where: { id } });
            return { code: "200", message: "Usuario eliminado satisfactoriamente", timestamp: new Date(), data: deletedUser };
        } catch (error: any) {
            throw new Error(`Error eliminando el usuario: ${error.message}`);
        }
    }
}