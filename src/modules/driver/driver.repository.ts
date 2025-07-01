import { PrismaClient, Driver } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateDriverDto } from "./dto/create-driver.dto";
import { UpdateDriverDto } from "./dto/update-driver.dto";
import { DriverRepositoryInterface } from "./interfaces/DriverRepository.interface";

export class DriverRepository implements DriverRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<Driver[]> {
        const drivers = await this.prisma.driver.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return drivers;
    }

    async findById(id: number): Promise<Driver> {
        try {
            const driver = await this.prisma.driver.findUnique({
                where: { id }
            });
            if (!driver) {
                throw new ApiError(404, `Conductor con id ${id} no encontrado.`);
            }
            return driver;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el conductor con id ${id}`);
        }
    }

    async findByUserId(userId: number): Promise<Driver | null> {
        try {
            const driver = await this.prisma.driver.findFirst({
                where: { userId }
            });
            return driver;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar conductor del usuario con id ${userId}`);
        }
    }

    async createDriver(driverData: CreateDriverDto): Promise<Driver> {
        try {
            // Verificar si ya existe un conductor para este usuario
            const existingDriver = await this.prisma.driver.findFirst({
                where: { userId: driverData.userId }
            });

            if (existingDriver) {
                throw new ApiError(409, `Ya existe un conductor registrado para el usuario con id ${driverData.userId}.`);
            }

            const driver = await this.prisma.driver.create({
                data: driverData
            });
            return driver;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear el conductor: ${error.message}`);
        }
    }

    async updateDriver(id: number, driverData: UpdateDriverDto): Promise<Driver> {
        try {
            const driver = await this.prisma.driver.findUnique({
                where: { id }
            });
            if (!driver) {
                throw new ApiError(404, `Conductor con id ${id} no encontrado.`);
            }

            // Si se está actualizando el userId, verificar que no haya conflictos
            if (driverData.userId && driverData.userId !== driver.userId) {
                const existingDriver = await this.prisma.driver.findFirst({
                    where: {
                        userId: driverData.userId,
                        id: { not: id }
                    }
                });

                if (existingDriver) {
                    throw new ApiError(409, `Ya existe un conductor registrado para el usuario con id ${driverData.userId}.`);
                }
            }

            const updatedDriver = await this.prisma.driver.update({
                where: { id },
                data: driverData
            });
            return updatedDriver;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar el conductor con id ${id}`);
        }
    }

    async deleteDriver(id: number): Promise<void> {
        try {
            const driver = await this.prisma.driver.findUnique({
                where: { id }
            });
            if (!driver) {
                throw new ApiError(404, `Conductor con id ${id} no encontrado.`);
            }
            await this.prisma.driver.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar el conductor con id ${id}`);
        }
    }
}