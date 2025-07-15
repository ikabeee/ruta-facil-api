import { PrismaClient, OwnerVehicle } from "../../../generated/prisma";
import { ApiError } from "../../shared/errors/ApiError";
import { CreateOwnerVehicleDto } from "./dto/create-owner-vehicle.dto";
import { UpdateOwnerVehicleDto } from "./dto/update-owner-vehicle.dto";
import { OwnerVehicleRepositoryInterface } from "./interfaces/OwnerVehicleRepository.interface";

export class OwnerVehicleRepository implements OwnerVehicleRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient
    ) { }

    async findAll(): Promise<OwnerVehicle[]> {
        const ownerVehicles = await this.prisma.ownerVehicle.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return ownerVehicles;
    }

    async findById(id: number): Promise<OwnerVehicle> {
        try {
            const ownerVehicle = await this.prisma.ownerVehicle.findUnique({
                where: { id }
            });
            if (!ownerVehicle) {
                throw new ApiError(404, `Propietario de vehículo con id ${id} no encontrado.`);
            }
            return ownerVehicle;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al buscar el propietario de vehículo con id ${id}`);
        }
    }

    async findByUserId(userId: number): Promise<OwnerVehicle[]> {
        try {
            const ownerVehicles = await this.prisma.ownerVehicle.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
            return ownerVehicles;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar vehículos del usuario con id ${userId}`);
        }
    }

    async findByVehicleId(vehicleId: number): Promise<OwnerVehicle[]> {
        try {
            // Buscar OwnerVehicle a través de la relación con Vehicle
            const ownerVehicles = await this.prisma.ownerVehicle.findMany({
                where: {
                    vehicles: {
                        some: {
                            id: vehicleId
                        }
                    }
                },
                include: {
                    vehicles: true
                },
                orderBy: { createdAt: 'desc' }
            });
            return ownerVehicles;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar propietarios del vehículo con id ${vehicleId}`);
        }
    }

    async findByUserIdAndVehicleId(userId: number, vehicleId: number): Promise<OwnerVehicle | null> {
        try {
            // Buscar OwnerVehicle por userId que tenga el vehículo específico
            const ownerVehicle = await this.prisma.ownerVehicle.findFirst({
                where: {
                    userId,
                    vehicles: {
                        some: {
                            id: vehicleId
                        }
                    }
                },
                include: {
                    vehicles: true
                }
            });
            return ownerVehicle;
        } catch (error: any) {
            throw new ApiError(500, `Error al buscar relación usuario-vehículo`);
        }
    }

    async createOwnerVehicle(ownerVehicleData: CreateOwnerVehicleDto): Promise<OwnerVehicle> {
        try {
            // Verificar si ya existe un registro de OwnerVehicle para este usuario
            const existingOwner = await this.prisma.ownerVehicle.findFirst({
                where: {
                    userId: ownerVehicleData.userId
                }
            });

            if (existingOwner) {
                throw new ApiError(409, `Ya existe un registro de propietario para el usuario ${ownerVehicleData.userId}.`);
            }

            const ownerVehicle = await this.prisma.ownerVehicle.create({
                data: ownerVehicleData,
                include: {
                    vehicles: true,
                    notifications: true
                }
            });
            return ownerVehicle;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al crear el propietario de vehículo: ${error.message}`);
        }
    }

    async updateOwnerVehicle(id: number, ownerVehicleData: UpdateOwnerVehicleDto): Promise<OwnerVehicle> {
        try {
            const ownerVehicle = await this.prisma.ownerVehicle.findUnique({
                where: { id }
            });
            if (!ownerVehicle) {
                throw new ApiError(404, `Propietario de vehículo con id ${id} no encontrado.`);
            }

            // Si se está actualizando userId, verificar que no haya conflictos
            if (ownerVehicleData.userId && ownerVehicleData.userId !== ownerVehicle.userId) {
                const existingOwner = await this.prisma.ownerVehicle.findFirst({
                    where: {
                        userId: ownerVehicleData.userId,
                        id: { not: id }
                    }
                });

                if (existingOwner) {
                    throw new ApiError(409, `Ya existe un registro de propietario para el usuario ${ownerVehicleData.userId}.`);
                }
            }

            const updatedOwnerVehicle = await this.prisma.ownerVehicle.update({
                where: { id },
                data: ownerVehicleData,
                include: {
                    vehicles: true,
                    notifications: true
                }
            });
            return updatedOwnerVehicle;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al actualizar el propietario de vehículo con id ${id}`);
        }
    }

    async deleteOwnerVehicle(id: number): Promise<void> {
        try {
            const ownerVehicle = await this.prisma.ownerVehicle.findUnique({
                where: { id }
            });
            if (!ownerVehicle) {
                throw new ApiError(404, `Propietario de vehículo con id ${id} no encontrado.`);
            }
            await this.prisma.ownerVehicle.delete({
                where: { id }
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, `Error al eliminar el propietario de vehículo con id ${id}`);
        }
    }
}